// POST /api/generate-narrative
//
// Accepts a GenerateRequest body ({ model, structuredData }) and streams the
// AI-generated PCR narrative back as plain text.
//
// Flow:
//   1. Validates that ANTHROPIC_API_KEY is set and the request body is well-formed.
//   2. Calls the Anthropic streaming API with the system prompt (formats.ts) and
//      the structured user prompt built from the form data (structured.ts).
//   3. Wraps the SDK's async stream in a Web ReadableStream, encoding each text
//      delta chunk and forwarding it to the client as it arrives.
//   4. Returns 429 if the Anthropic API rate limit is hit; 500 for all other errors.
//
// runtime = "nodejs" is required because the Anthropic SDK uses Node.js streams
// internally — the Edge runtime is not compatible.

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
