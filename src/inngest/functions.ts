import { db } from "~/server/db";
import { inngest } from "./client";
import { connectionsSchema } from "~/server/db/schema";
import { embed, generateText } from "ai";
import { createEmbedding } from "~/ai-core/embedding";
import { model } from "~/ai-core/model";
import { linkedinScraper } from "~/services/linkedin-scraper";
import { PROFILE_SUMMARY_SYSTEM_PROMPT } from "~/ai-core/prompts";

export const connectionAdd = inngest.createFunction(
  { id: "connection-add", retries: 2 },
  { event: "connection/add" },
  async ({ event, step }) => {
    await step.run("add-to-database", async () => {
      const { linkedinURL } = event.data;

      let profile;
      try {
        profile = await linkedinScraper.fetchProfile(linkedinURL);
      } catch (err) {
        console.warn(`Failed to fetch profile for ${linkedinURL}:`, err);

        return;
      }

      const userPrompt = `
      Profile:
      - Summary: ${profile.summary || "N/A"}
      - Headline: ${profile.headline || "N/A"}
    
      Education:
      ${profile.educations
        ?.map(
          (ed) =>
            `- School: ${ed.schoolName}
      Degree: ${ed.degree}
      Field of Study: ${ed.fieldOfStudy}
      ${ed.description ? `Description: ${ed.description}` : ""}
      ${ed.activities ? `Activities: ${ed.activities}` : ""}`,
        )
        .join("\n")}
    
      Positions:
      ${profile.position
        ?.map(
          (pos) =>
            `- Title: ${pos.title}
      Company: ${pos.companyName}
      ${pos.location ? `Location: ${pos.location}` : ""}
      ${pos.employmentType ? `Employment Type: ${pos.employmentType}` : ""}
      ${pos.companyIndustry ? `Industry: ${pos.companyIndustry}` : ""}
      ${pos.description ? `Description: ${pos.description}` : ""}`,
        )
        .join("\n")}
    
      Languages:
      ${profile.languages?.map((l) => `- ${l.name} (${l.proficiency})`).join("\n")}
    
      Location: ${profile.geo?.full || "N/A"}
    
      Instructions:
      Using the above structured profile data, write a professional LinkedIn-style summary paragraph (3-5 sentences) that naturally integrates the information.
      `;

      const { text: profileSummary } = await generateText({
        model,
        system: PROFILE_SUMMARY_SYSTEM_PROMPT,
        prompt: userPrompt,
      });

      const { embedding } = await createEmbedding(profileSummary);

      await db.insert(connectionsSchema).values({ ...event.data, embedding });
    });
  },
);
