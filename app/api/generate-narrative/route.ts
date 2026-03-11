export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/anthropic";
import { getSystemPrompt } from "@/lib/prompts/formats";
import { buildStructuredPrompt } from "@/lib/prompts/structured";
import { GenerateRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 }
    );
  }

  let body: GenerateRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { model, structuredData } = body;

  if (!model || !structuredData) {
    return NextResponse.json(
      { error: "model and structuredData are required" },
      { status: 400 }
    );
  }

  try {
    const stream = await client.messages.stream({
      model,
      max_tokens: 1400,
      system: getSystemPrompt(),
      messages: [
        {
          role: "user",
          content: buildStructuredPrompt(structuredData),
        },
      ],
    });

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    if (error.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again in a moment." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: error.message ?? "Failed to generate narrative" },
      { status: 500 }
    );
  }
}
