const rules = [
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
];

export const normalizeLabel = (value) => value.replace(/\s+/g, " ").trim();

export const classifyField = (field) => {
  const haystack = normalizeLabel(
    [
      field.fieldLabel ?? field.label,
      field.name,
      field.id,
      field.placeholder,
      field.ariaLabel,
    ]
      .filter(Boolean)
      .join(" "),
  );

  for (const [kind, pattern] of rules) {
    if (pattern.test(haystack)) {
      return kind;
    }
  }

  return "custom";
};

export const mapDetectedFields = (fields) =>
  fields.map((field, index) => ({
    id: field.id || field.name || `field-${index}`,
    fieldLabel: normalizeLabel(
      field.fieldLabel ||
        field.label ||
        field.placeholder ||
        field.name ||
        `Field ${index + 1}`,
    ),
    kind: classifyField(field),
    confidence: classifyField(field) === "custom" ? 0.35 : 0.78,
  }));
