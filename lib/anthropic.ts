// anthropic.ts — shared Anthropic SDK client instance.
// Initialized once here and imported by the API route to avoid creating
// a new client on every request.

import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export default client;
