const rules = [
  [
    "disability",
    /\b(disability|disabled|form cc-305|reasonable accommodation)\b/i,
  ],
  ["veteran", /\b(veteran|protected veteran|armed forces|military service)\b/i],
  [
    "race",
    /\b(race|ethnicity|hispanic|latino|black|african american|asian|white|native hawaiian|pacific islander|american indian|alaska native|two or more races)\b/i,
  ],
  ["gender", /\b(gender|male|female|non-binary|decline to self-identify)\b/i],
  ["pronouns", /\b(pronouns|she\/her|he\/him|they\/them)\b/i],
  ["email", /\b(e-?mail|email address)\b/i],
  ["phone", /\b(phone|mobile|cell)\b/i],
  ["firstName", /\b(first name|given name)\b/i],
  ["lastName", /\b(last name|surname|family name)\b/i],
  ["fullName", /\b(full name|legal name|name)\b/i],
  ["location", /\b(city|state|location|address)\b/i],
  ["linkedin", /\b(linkedin)\b/i],
  ["portfolio", /\b(portfolio|website|github|personal site)\b/i],
  ["resume", /\b(resume|cv)\b/i],
  ["coverLetter", /\b(cover letter)\b/i],
  [
    "workAuthorization",
    /\b(authorized|work authorization|eligible to work)\b/i,
  ],
  ["sponsorship", /\b(sponsor|sponsorship|visa)\b/i],
  ["salary", /\b(salary|compensation|pay)\b/i],
  [
    "eeo",
    /\b(eeo|equal employment|self-identify|voluntary self-identification|demographic)\b/i,
  ],
];

export const normalizeLabel = (value) => value.replace(/\s+/g, " ").trim();

const getFieldOptionsText = (field) =>
  Array.isArray(field.options) ? field.options.join(" ") : "";

export const getFieldHaystack = (field) =>
  normalizeLabel(
    [
      field.fieldLabel ?? field.label,
      field.sectionLabel,
      field.nearbyText,
      field.name,
      field.id,
      field.placeholder,
      field.ariaLabel,
      getFieldOptionsText(field),
    ]
      .filter(Boolean)
      .join(" "),
  );

const getBestFieldLabel = (field, index) =>
  normalizeLabel(
    field.fieldLabel ||
      field.label ||
      field.placeholder ||
      field.ariaLabel ||
      field.sectionLabel ||
      field.nearbyText ||
      field.name ||
      field.id ||
      `Field ${index + 1}`,
  );

export const classifyField = (field) => {
  const haystack = getFieldHaystack(field);

  for (const [kind, pattern] of rules) {
    if (pattern.test(haystack)) {
      return kind;
    }
  }

  return "custom";
};

export const mapDetectedFields = (fields) =>
  fields.map((field, index) => {
    const kind = classifyField(field);
    const hasHumanLabel = Boolean(
      normalizeLabel(
        field.fieldLabel ||
          field.label ||
          field.placeholder ||
          field.ariaLabel ||
          field.sectionLabel ||
          field.nearbyText ||
          "",
      ),
    );

    return {
      id: field.id || field.name || `field-${index}`,
      fieldLabel: getBestFieldLabel(field, index),
      kind,
      confidence: kind === "custom" ? 0.35 : hasHumanLabel ? 0.82 : 0.58,
      required: Boolean(field.required),
    };
  });
