import assert from "node:assert/strict";
import test from "node:test";
import { classifyField, mapDetectedFields } from "../shared/field-detection.js";
import { createDraftSuggestions } from "../shared/mock-data.js";

test("classifies common contact fields", () => {
  assert.equal(classifyField({ label: "Email address" }), "email");
  assert.equal(classifyField({ label: "First name" }), "firstName");
  assert.equal(classifyField({ label: "LinkedIn profile" }), "linkedin");
});

test("maps unknown fields as custom with lower confidence", () => {
  const [field] = mapDetectedFields([{ label: "Tell us something unusual" }]);
  assert.equal(field.kind, "custom");
  assert.equal(field.confidence, 0.35);
});

test("creates draft suggestions and marks sensitive answers for review", () => {
  const draft = createDraftSuggestions({
    platform: "greenhouse",
    mode: "tailored-draft",
    fields: [{ label: "Will you require sponsorship?" }, { label: "Email" }],
  });
  const sponsorship = draft.suggestions.find(
    (suggestion) => suggestion.kind === "sponsorship",
  );
  const email = draft.suggestions.find(
    (suggestion) => suggestion.kind === "email",
  );

  assert.equal(sponsorship.requiresReview, true);
  assert.equal(email.requiresReview, false);
  assert.equal(draft.platform, "greenhouse");
  assert.equal(draft.mode, "tailored-draft");
});
