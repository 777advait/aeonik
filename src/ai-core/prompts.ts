import type { Profile } from "~/services/linkedin-scraper";

export const PROFILE_SUMMARY_SYSTEM_PROMPT = `You are an AI assistant specialized in creating concise, professional LinkedIn-style profile summaries. 
- Always generate clear, natural-sounding paragraphs. 
- Ground your output in the structured data provided. 
- If data is missing, gracefully omit it without making assumptions. 
- Keep summaries to 3-5 sentences. 
- Prefer professional and readable tone. 
`;

export const getProfileSummaryUserPrompt = (profile: Profile) => `
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
