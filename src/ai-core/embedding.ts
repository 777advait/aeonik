import { embed } from "ai";
import { azure } from "./providers";

export const embeddingModel = azure.textEmbedding("text-embedding-3-small");

export const createEmbedding = async (value: string) =>
  await embed({
    model: embeddingModel,
    value,
    providerOptions: { azure: { dimensions: 1536 } },
  });
