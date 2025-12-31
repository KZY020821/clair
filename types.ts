export enum AppStep {
  UPLOAD = 1,
  REFINE = 2,
  RESULTS = 3,
}

export interface WorkExperience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
}

export interface Project {
  name: string;
  description: string;
  link?: string;
}

export interface Language {
  language: string;
  proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Native';
}

export interface UserLinks {
  linkedin?: string;
  portfolio?: string;
  github?: string;
  other?: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  certifications: string[];
  languages: Language[];
  projects: Project[];
  links: UserLinks;
}

export interface JobSearchCriteria {
  targetCountry: string;
  targetJobTitle: string;
  resumeFileBase64: string;
  resumeMimeType: string;
}

export interface JobListing {
  title: string;
  company: string;
  location: string;
  platform: string;
  url: string;
  matchScore?: number;
}

export interface CareerAdvice {
  resumeScore: number; // Out of 10
  resumeCritique: string;
  executiveSummary: string;
  skillGapAnalysis: string;
  improvementSuggestion: string;
  recommendedRoleTitle: string;
  jobs: JobListing[];
  groundingUrls?: { title: string; uri: string }[];
}

// Helper to create empty profile
export const createEmptyProfile = (): UserProfile => ({
  fullName: '',
  email: '',
  phone: '',
  summary: '',
  skills: [],
  experience: [],
  education: [],
  certifications: [],
  languages: [],
  projects: [],
  links: { linkedin: '', portfolio: '', github: '', other: '' },
});
