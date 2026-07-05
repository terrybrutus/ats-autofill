import { mapDetectedFields } from "./field-detection.js";
import { sensitiveFieldKinds } from "./schemas.js";

export const mockProfile = {
  id: "profile_local_terry",
  updatedAt: new Date("2026-07-03T12:00:00.000Z").toISOString(),
  identity: {
    firstName: "Terry",
    lastName: "Brutus",
    fullName: "Terry Brutus",
    email: "terry@example.com",
    phone: "555-0100",
    location: "United States",
    linkedin: "https://www.linkedin.com/in/example",
    portfolio: "https://example.com",
  },
  preferences: {
    reviewSensitiveFields: true,
    defaultMode: "approved-answer",
  },
  highlights: [
    "Builds practical AI-assisted workflows and portfolio-grade product systems.",
    "Experienced with frontend applications, product strategy, and automation tools.",
    "Prefers review-first systems that improve quality without hiding the user's judgment.",
  ],
};

export const mockAnswerBank = [
  {
    id: "answer_work_auth",
    kind: "workAuthorization",
    prompt: "Are you authorized to work in the United States?",
    answer: "Yes",
    mode: "approved",
  },
  {
    id: "answer_sponsorship",
    kind: "sponsorship",
    prompt: "Will you now or in the future require sponsorship?",
    answer: "No",
    mode: "approved",
  },
];

export const mockApplications = [
  {
    id: "application_demo",
    company: "Example Co",
    title: "Frontend Engineer",
    platform: "generic",
    status: "draft",
    updatedAt: new Date("2026-07-03T12:00:00.000Z").toISOString(),
  },
];

const valuesByKind = {
  firstName: mockProfile.identity.firstName,
  lastName: mockProfile.identity.lastName,
  fullName: mockProfile.identity.fullName,
  email: mockProfile.identity.email,
  phone: mockProfile.identity.phone,
  location: mockProfile.identity.location,
  linkedin: mockProfile.identity.linkedin,
  portfolio: mockProfile.identity.portfolio,
  workAuthorization: "Yes",
  sponsorship: "No",
};

export const createDraftSuggestions = (request) => {
  const detectedFields = Array.isArray(request.fields) ? request.fields : [];
  const mappedFields = mapDetectedFields(detectedFields);

  return {
    id: `draft_${Date.now()}`,
    mode: request.mode ?? "approved-answer",
    platform: request.platform ?? "generic",
    job: request.job ?? {
      company: "Unknown company",
      title: "Unknown role",
      url: request.url ?? "",
    },
    suggestions: mappedFields.map((field) => ({
      fieldId: field.id,
      fieldLabel: field.fieldLabel,
      kind: field.kind,
      value: valuesByKind[field.kind] ?? "",
      confidence: field.confidence,
      requiresReview:
        sensitiveFieldKinds.has(field.kind) || field.kind === "custom",
    })),
  };
};
