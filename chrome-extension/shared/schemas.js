export const atsPlatforms = [
  "generic",
  "greenhouse",
  "lever",
  "ashby",
  "workable",
  "smartrecruiters",
  "workday",
  "icims",
  "taleo",
  "bamboohr",
];

export const fieldKinds = [
  "firstName",
  "lastName",
  "fullName",
  "email",
  "phone",
  "location",
  "linkedin",
  "portfolio",
  "resume",
  "coverLetter",
  "workAuthorization",
  "sponsorship",
  "salary",
  "gender",
  "race",
  "veteran",
  "disability",
  "pronouns",
  "eeo",
  "custom",
];

export const sensitiveFieldKinds = new Set([
  "workAuthorization",
  "sponsorship",
  "salary",
  "gender",
  "race",
  "veteran",
  "disability",
  "pronouns",
  "eeo",
]);

export const isKnownPlatform = (value) => atsPlatforms.includes(value);

export const isKnownFieldKind = (value) => fieldKinds.includes(value);
