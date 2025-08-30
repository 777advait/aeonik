import { db } from "~/server/db";
import { inngest } from "./client";
import { connectionsSchema } from "~/server/db/schema";
import { embed } from "ai";
import { embeddingModel } from "~/ai-core/embedding";

export const connectionAdd = inngest.createFunction(
  { id: "connection-add" },
  { event: "connection/add" },
  async ({ event, step }) => {
    await step.run("add-to-database", async () => {
      const { name, company, connectedOn, linkedinURL, position } = event.data;

      const profile = `
      - Name: ${name}
      - Company: ${company}
      - Position: ${position}
      - Linkedin URL: ${linkedinURL}
      - Connected On: ${connectedOn}
      `;

      const { embedding } = await embed({
        model: embeddingModel,
        value: profile,
        providerOptions: {
          providerOptions: {
            azure: {
              dimensions: 1536, // optional, number of dimensions for the embedding
            },
          },
        },
      });

      await db.insert(connectionsSchema).values({ ...event.data, embedding });
    });
  },
);
