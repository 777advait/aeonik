import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import type { NextRequest } from "next/server";
import { model } from "~/ai-core/model";
import { makeSearchConnectionsTool } from "~/ai-core/tools/search-connections";
import { createClient } from "~/utils/supabase/server";

export async function POST(req: NextRequest) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) throw new Error("UNAUTHORIZED");

  const res = streamText({
    model,
    prompt: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    system: `You are a professional AI assistant specialized in helping users find relevant connections from their network. 

Your job is to:
1. Search through semantic profiles of the user's connections.
2. Identify people who are most likely to be useful or relevant for the user's current context, query, or objective.
3. When suggesting connections, always provide a short explanation for *why* each person is recommended, based on shared industries, roles, locations, groups, or experience.
4. Present recommendations in a clear, friendly format, with each suggestion as a bullet point including:
5. After listing the suggested connections, include 1-2 sentences summarizing *why* they were chosen.
6. Be concise, professional, and avoid making assumptions beyond the data in the user's semantic profiles.
`,
    tools: { searchConnections: makeSearchConnectionsTool(user.id) },
  });

  return res.toUIMessageStreamResponse();
}
