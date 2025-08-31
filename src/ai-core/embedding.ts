import { embed, embedMany } from "ai";
import { azure } from "./providers";

export const embeddingModel = azure.textEmbedding("text-embedding-3-small");

export const createEmbeddingMany = async (values: string[]) =>
  await embedMany({
    model: embeddingModel,
    values,
    providerOptions: { azure: { dimensions: 1536 } },
  });

export const createEmbedding = async (value: string) =>
  await embed({
    model: embeddingModel,
    value,
    providerOptions: { azure: { dimensions: 1536 } },
  });
