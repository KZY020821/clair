import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, CareerAdvice } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for Resume Extraction
const resumeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    fullName: { type: Type.STRING },
    email: { type: Type.STRING },
    phone: { type: Type.STRING },
    summary: { type: Type.STRING },
    skills: { type: Type.ARRAY, items: { type: Type.STRING } },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          role: { type: Type.STRING },
          duration: { type: Type.STRING },
          description: { type: Type.STRING }
        }
      }
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          institution: { type: Type.STRING },
          degree: { type: Type.STRING },
          year: { type: Type.STRING }
        }
      }
    },
    certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
    languages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          language: { type: Type.STRING },
          proficiency: { type: Type.STRING, enum: ['Basic', 'Intermediate', 'Advanced', 'Native'] }
        }
      }
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          link: { type: Type.STRING }
        }
      }
    },
    links: {
      type: Type.OBJECT,
      properties: {
        linkedin: { type: Type.STRING },
        portfolio: { type: Type.STRING },
        github: { type: Type.STRING },
        other: { type: Type.STRING }
      }
    }
  },
  required: ["fullName", "experience"]
};

// Schema for Career Advice & Jobs
const adviceSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    resumeScore: { type: Type.NUMBER, description: "Score out of 10 based on quality and relevance to target role." },
    resumeCritique: { type: Type.STRING, description: "Detailed critique of the resume structure and content." },
    executiveSummary: { type: Type.STRING },
    skillGapAnalysis: { type: Type.STRING },
    improvementSuggestion: { type: Type.STRING },
    recommendedRoleTitle: { type: Type.STRING },
    jobs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          company: { type: Type.STRING },
          location: { type: Type.STRING },
          platform: { type: Type.STRING },
          url: { type: Type.STRING },
          matchScore: { type: Type.NUMBER }
        }
      }
    }
  }
};

export const extractResumeData = async (
  fileBase64: string,
  mimeType: string,
  targetJob: string,
  country: string
): Promise<UserProfile> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: fileBase64
            }
          },
          {
            text: `Extract the resume data. Be precise. For languages, estimate proficiency if not stated. Look for links to LinkedIn or Portfolios.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as UserProfile;
  } catch (error) {
    console.error("Extraction Error:", error);
    throw new Error("Failed to extract resume data.");
  }
};

export const generateCareerAdvice = async (
  profile: UserProfile,
  targetJob: string,
  country: string
): Promise<CareerAdvice> => {
  try {
    const profileString = JSON.stringify(profile);
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Analyze this user profile: ${profileString}.
        Target Role: ${targetJob}
        Target Country: ${country}

        1. Score the resume out of 10 based on ATS friendliness and content quality for the target role.
        2. Provide a critique of the resume.
        3. Analyze skill gaps.
        4. Suggest improvements.
        5. Search for current job listings for '${targetJob}' in '${country}'.
        
        Return JSON matching schema.
      `,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: adviceSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text) as CareerAdvice;

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const groundingUrls: { title: string; uri: string }[] = [];
    
    if (groundingChunks) {
      groundingChunks.forEach(chunk => {
        if (chunk.web) {
          groundingUrls.push({ title: chunk.web.title || "Source", uri: chunk.web.uri || "#" });
        }
      });
    }

    return { ...data, groundingUrls };

  } catch (error) {
    console.error("Advice Generation Error:", error);
    throw new Error("Failed to generate career advice.");
  }
};
