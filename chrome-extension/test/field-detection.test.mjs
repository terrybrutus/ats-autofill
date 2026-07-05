import assert from "node:assert/strict";
import test from "node:test";
import { classifyField, mapDetectedFields } from "../shared/field-detection.js";
import { createDraftSuggestions } from "../shared/mock-data.js";

test("classifies common contact fields", () => {
  assert.equal(classifyField({ fieldLabel: "Email address" }), "email");
  assert.equal(classifyField({ fieldLabel: "First name" }), "firstName");
  assert.equal(classifyField({ fieldLabel: "LinkedIn profile" }), "linkedin");
});

test("maps unknown fields as custom with lower confidence", () => {
  const [field] = mapDetectedFields([
    { fieldLabel: "Tell us something unusual" },
  ]);
  assert.equal(field.kind, "custom");
  assert.equal(field.confidence, 0.35);
});

test("uses surrounding context when a direct label is missing", () => {
  const [field] = mapDetectedFields([
    {
      id: "detected-6",
      fieldLabel: "",
      sectionLabel: "Profile links",
      nearbyText: "LinkedIn URL",
    },
  ]);

  assert.equal(field.fieldLabel, "Profile links");
  assert.equal(field.kind, "linkedin");
});

test("classifies compliance fields as sensitive kinds", () => {
  assert.equal(classifyField({ fieldLabel: "Veteran status" }), "veteran");
  assert.equal(
    classifyField({ fieldLabel: "Disability status" }),
    "disability",
  );
  assert.equal(classifyField({ fieldLabel: "Race / Ethnicity" }), "race");
});

test("creates draft suggestions and marks sensitive answers for review", () => {
  const draft = createDraftSuggestions({
    fields: [
      { fieldLabel: "Will you require sponsorship?" },
      { fieldLabel: "Email" },
      { fieldLabel: "Veteran status" },
    ],
  });
  const sponsorship = draft.suggestions.find(
    (suggestion) => suggestion.kind === "sponsorship",
  );
  const email = draft.suggestions.find(
    (suggestion) => suggestion.kind === "email",
  );
  const veteran = draft.suggestions.find(
    (suggestion) => suggestion.kind === "veteran",
  );

  assert.equal(sponsorship.requiresReview, true);
  assert.equal(email.requiresReview, false);
  assert.equal(veteran.requiresReview, true);
});
