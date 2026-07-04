export interface ProfileIdentity {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
}

export interface WorkExperience {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface Project {
  name: string;
  url: string;
  summary: string;
  highlights: string[];
}

export interface LivingProfile {
  identity: ProfileIdentity;
  headline: string;
  summary: string;
  skills: string[];
  experience: WorkExperience[];
  projects: Project[];
  education: string[];
  preferences: string[];
  updatedAt: bigint;
}

export interface AnswerBankEntry {
  id: bigint;
  kind: string;
  prompt: string;
  answer: string;
  sensitive: boolean;
  updatedAt: bigint;
}

export interface ApplicationRecord {
  id: bigint;
  company: string;
  title: string;
  url: string;
  platform: string;
  status: string;
  usedAnswerIds: bigint[];
  createdAt: bigint;
  updatedAt: bigint;
}

export interface DetectedField {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  ariaLabel: string;
  tagName: string;
  fieldType: string;
}

export interface DraftJobContext {
  company: string;
  title: string;
  description: string;
}

export interface DraftRequest {
  url: string;
  pageTitle: string;
  platform: string;
  mode: string;
  job: DraftJobContext;
  fields: DetectedField[];
}

export interface FieldSuggestion {
  fieldId: string;
  label: string;
  kind: string;
  value: string;
  confidence: bigint;
  source: string;
  requiresReview: boolean;
}

export interface DraftResponse {
  id: bigint;
  mode: string;
  platform: string;
  url: string;
  suggestions: FieldSuggestion[];
  createdAt: bigint;
}
