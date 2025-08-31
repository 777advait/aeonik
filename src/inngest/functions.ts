import { db } from "~/server/db";
import { inngest } from "./client";
import { connectionsSchema } from "~/server/db/schema";
import { generateText } from "ai";
import { createEmbedding } from "~/ai-core/embedding";
import { model } from "~/ai-core/model";
import { linkedinScraper, type Profile } from "~/services/linkedin-scraper";
import {
  getProfileSummaryUserPrompt,
  PROFILE_SUMMARY_SYSTEM_PROMPT,
} from "~/ai-core/prompts";

export const connectionAdd = inngest.createFunction(
  { id: "connection-add", retries: 2 },
  { event: "connection/add" },
  async ({ event, step }) => {
    await step.run("add-to-database", async () => {
      const { linkedinURL } = event.data;

      let profile: Profile;
      try {
        profile = await linkedinScraper.fetchProfile(linkedinURL);
      } catch (err) {
        console.warn(`Failed to fetch profile for ${linkedinURL}:`, err);

        return;
      }

      const userPrompt = getProfileSummaryUserPrompt(profile);

      const { text: profileSummary } = await generateText({
        model,
        system: PROFILE_SUMMARY_SYSTEM_PROMPT,
        prompt: userPrompt,
      });

      const { embedding } = await createEmbedding(profileSummary);

      await db
        .insert(connectionsSchema)
        .values({ ...event.data, summary: profileSummary, embedding });
    });
  },
);
