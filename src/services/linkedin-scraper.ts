import { env } from "~/env";
import ky, { HTTPError } from "ky";
import { generateText } from "ai";
import { model } from "~/ai-core/model";
import { PROFILE_SUMMARY_SYSTEM_PROMPT } from "~/ai-core/prompts";

type Educations = {
  schoolName: string;
  description: string;
  activities: string;
  degree: string;
  fieldOfStudy: string;
};

type Position = {
  companyName: string;
  title: string;
  location: string;
  description: string;
  employmentType: string;
  companyIndustry: string;
};

type Languages = {
  name: string;
  proficiency: string;
};

type Geo = { full: string };

export type Profile = {
  summary: string;
  headline: string;
  educations?: Educations[];
  position?: Position[];
  geo?: Geo;
  languages?: Languages[];
};

class LinkedinScraper {
  private readonly apiUrl = new URL(env.LINKEDIN_SCRAPER_API_URL);
  private readonly apiHost = env.LINKEDIN_SCRAPER_RAPID_API_HOST;
  private readonly apiKey = env.LINKEDIN_SCRAPER_RAPID_API_KEY;

  private readonly api = ky.create({
    prefixUrl: this.apiUrl,
    timeout: 10000,
    retry: {
      limit: 3,
      methods: ["GET", "POST"],
      statusCodes: [408, 413, 429, 500, 502, 503, 504],
    },
  });

  private async makeRequest<ResponseShape>(args: {
    endpoint: string;
    method: "GET" | "POST";
    options?: {
      query?: Record<string, string>;
      body?: Record<string, any>;
    };
  }): Promise<ResponseShape> {
    const { endpoint, method, options } = args;
    const { query, body } = options ?? {};

    try {
      return await this.api<ResponseShape>(endpoint.replace(/^\//, ""), {
        method,
        headers: {
          "X-Rapidapi-Key": this.apiKey,
          "X-Rapidapi-Host": this.apiHost,
        },
        ...(query ? { searchParams: query } : {}),
        ...(method === "POST" && body ? { json: body } : {}),
      }).json();
    } catch (err) {
      throw err instanceof HTTPError
        ? new Error(
            `[${this.apiUrl.host}${this.apiUrl.pathname}] Request failed: ${err.message}`,
          )
        : new Error(
            `[${this.apiUrl.host}${this.apiUrl.pathname}] Request failed: ${String(err)}`,
          );
    }
  }

  async fetchProfile(url: string) {
    return this.makeRequest<Profile>({
      endpoint: "/get-profile-data-by-url",
      method: "GET",
      options: {
        query: { url },
      },
    });
  }
}

export const linkedinScraper = new LinkedinScraper();

// USAGE

// const profile = await linkedinScraper.fetchProfile(
//   "https://linkedin.com/in/777advait",
// );

// const userPrompt = `
// Profile:
// - Summary: ${profile.summary || "N/A"}
// - Headline: ${profile.headline || "N/A"}

// Education:
// ${profile.educations
//   .map(
//     (ed) =>
//       `- School: ${ed.schoolName}
//   Degree: ${ed.degree}
//   Field of Study: ${ed.fieldOfStudy}
//   ${ed.description ? `Description: ${ed.description}` : ""}
//   ${ed.activities ? `Activities: ${ed.activities}` : ""}`,
//   )
//   .join("\n")}

// Positions:
// ${profile.position
//   .map(
//     (pos) =>
//       `- Title: ${pos.title}
//   Company: ${pos.companyName}
//   ${pos.location ? `Location: ${pos.location}` : ""}
//   ${pos.employmentType ? `Employment Type: ${pos.employmentType}` : ""}
//   ${pos.companyIndustry ? `Industry: ${pos.companyIndustry}` : ""}
//   ${pos.description ? `Description: ${pos.description}` : ""}`,
//   )
//   .join("\n")}

// Languages:
// ${profile.languages.map((l) => `- ${l.name} (${l.proficiency})`).join("\n")}

// Location: ${profile.geo.full || "N/A"}

// Instructions:
// Using the above structured profile data, write a professional LinkedIn-style summary paragraph (3-5 sentences) that naturally integrates the information.
// `;

// const { text: profileSummary } = await generateText({
//   model,
//   system: PROFILE_SUMMARY_SYSTEM_PROMPT,
//   prompt: userPrompt,
// });

// console.log(profileSummary);
