import type { InferUITool, UIDataTypes, UIMessage } from "ai";
import type { searchSimilarConnections } from "./search";
import type { Await } from "inngest/helpers/types";
import type { makeSearchConnectionsTool } from "./tools/search-connections";

export type TSearchConnectionsTool = InferUITool<
  ReturnType<typeof makeSearchConnectionsTool>
>;

export type ChatTools = { searchConnections: TSearchConnectionsTool };
export type ChatMessage = UIMessage<unknown, UIDataTypes, ChatTools>;
