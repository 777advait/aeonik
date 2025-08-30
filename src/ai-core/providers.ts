import { createAzure } from "@ai-sdk/azure";
import { env } from "~/env";

export const azure = createAzure({
  resourceName: env.AZURE_OPENAI_RESOURCE_NAME,
  apiKey: env.AZURE_OPENAI_API_KEY,
});
