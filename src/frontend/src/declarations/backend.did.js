/* eslint-disable */
// @ts-nocheck

import { IDL } from "@icp-sdk/core/candid";

export const Error = IDL.Variant({
  FrontendOriginsNotConfigured: IDL.Null,
  MixedSsoSources: IDL.Record({
    otherKeys: IDL.Vec(IDL.Text),
    ssoKeys: IDL.Vec(IDL.Text),
  }),
  Stale: IDL.Record({ ageNs: IDL.Nat }),
  MalformedCandid: IDL.Null,
  AmbiguousAttribute: IDL.Record({
    field: IDL.Text,
    sources: IDL.Vec(IDL.Text),
  }),
  NoAttributes: IDL.Null,
  UnknownNonce: IDL.Null,
  UntrustedSsoSource: IDL.Record({ domain: IDL.Text }),
  MissingField: IDL.Text,
  FrontendOriginMismatch: IDL.Record({
    got: IDL.Text,
    expected: IDL.Vec(IDL.Text),
  }),
});
export const Result = IDL.Variant({ ok: IDL.Null, err: Error });
export const UserRole = IDL.Variant({
  admin: IDL.Null,
  user: IDL.Null,
  guest: IDL.Null,
});
export const ProfileIdentity = IDL.Record({
  email: IDL.Text,
  fullName: IDL.Text,
  linkedin: IDL.Text,
  location: IDL.Text,
  phone: IDL.Text,
  portfolio: IDL.Text,
});
export const WorkExperience = IDL.Record({
  company: IDL.Text,
  endDate: IDL.Text,
  highlights: IDL.Vec(IDL.Text),
  startDate: IDL.Text,
  title: IDL.Text,
});
export const Project = IDL.Record({
  highlights: IDL.Vec(IDL.Text),
  name: IDL.Text,
  summary: IDL.Text,
  url: IDL.Text,
});
export const LivingProfile = IDL.Record({
  education: IDL.Vec(IDL.Text),
  experience: IDL.Vec(WorkExperience),
  headline: IDL.Text,
  identity: ProfileIdentity,
  preferences: IDL.Vec(IDL.Text),
  projects: IDL.Vec(Project),
  skills: IDL.Vec(IDL.Text),
  summary: IDL.Text,
  updatedAt: IDL.Int,
});
export const AnswerBankEntry = IDL.Record({
  answer: IDL.Text,
  id: IDL.Nat,
  kind: IDL.Text,
  prompt: IDL.Text,
  sensitive: IDL.Bool,
  updatedAt: IDL.Int,
});
export const ApplicationRecord = IDL.Record({
  company: IDL.Text,
  createdAt: IDL.Int,
  id: IDL.Nat,
  platform: IDL.Text,
  status: IDL.Text,
  title: IDL.Text,
  updatedAt: IDL.Int,
  url: IDL.Text,
  usedAnswerIds: IDL.Vec(IDL.Nat),
});
export const DraftJobContext = IDL.Record({
  company: IDL.Text,
  description: IDL.Text,
  title: IDL.Text,
});
export const DetectedField = IDL.Record({
  ariaLabel: IDL.Text,
  fieldType: IDL.Text,
  id: IDL.Text,
  fieldLabel: IDL.Text,
  name: IDL.Text,
  placeholder: IDL.Text,
  tagName: IDL.Text,
});
export const DraftRequest = IDL.Record({
  fields: IDL.Vec(DetectedField),
  job: DraftJobContext,
  mode: IDL.Text,
  pageTitle: IDL.Text,
  platform: IDL.Text,
  url: IDL.Text,
});
export const FieldSuggestion = IDL.Record({
  confidence: IDL.Nat,
  fieldId: IDL.Text,
  kind: IDL.Text,
  fieldLabel: IDL.Text,
  requiresReview: IDL.Bool,
  source: IDL.Text,
  value: IDL.Text,
});
export const DraftResponse = IDL.Record({
  createdAt: IDL.Int,
  id: IDL.Nat,
  mode: IDL.Text,
  platform: IDL.Text,
  suggestions: IDL.Vec(FieldSuggestion),
  url: IDL.Text,
});

export const idlService = IDL.Service({
  __accessControlState: IDL.Func([], [IDL.Reserved], ["query"]),
  __answersState: IDL.Func([], [IDL.Reserved], ["query"]),
  __applicationsState: IDL.Func([], [IDL.Reserved], ["query"]),
  __draftsState: IDL.Func([], [IDL.Reserved], ["query"]),
  __profileState: IDL.Func([], [IDL.Reserved], ["query"]),
  _initialize_access_control: IDL.Func([], [], []),
  _internet_identity_sign_in_finish: IDL.Func([], [Result], []),
  _internet_identity_sign_in_start: IDL.Func([], [IDL.Vec(IDL.Nat8)], []),
  assignCallerUserRole: IDL.Func([IDL.Principal, UserRole], [], []),
  createApplication: IDL.Func(
    [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Vec(IDL.Nat)],
    [ApplicationRecord],
    [],
  ),
  createDraft: IDL.Func([DraftRequest], [DraftResponse], []),
  getCallerUserRole: IDL.Func([], [UserRole], ["query"]),
  getExtensionContractVersion: IDL.Func([], [IDL.Text], ["query"]),
  getProfile: IDL.Func([], [IDL.Opt(LivingProfile)], ["query"]),
  isCallerAdmin: IDL.Func([], [IDL.Bool], ["query"]),
  listAnswers: IDL.Func([], [IDL.Vec(AnswerBankEntry)], ["query"]),
  listApplications: IDL.Func([], [IDL.Vec(ApplicationRecord)], ["query"]),
  recentDrafts: IDL.Func([], [IDL.Vec(DraftResponse)], ["query"]),
  saveAnswer: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Bool], [AnswerBankEntry], []),
  saveProfile: IDL.Func([LivingProfile], [LivingProfile], []),
});

export const idlInitArgs = [];

export const idlFactory = ({ IDL }) => {
  const Error = IDL.Variant({
    FrontendOriginsNotConfigured: IDL.Null,
    MixedSsoSources: IDL.Record({
      otherKeys: IDL.Vec(IDL.Text),
      ssoKeys: IDL.Vec(IDL.Text),
    }),
    Stale: IDL.Record({ ageNs: IDL.Nat }),
    MalformedCandid: IDL.Null,
    AmbiguousAttribute: IDL.Record({
      field: IDL.Text,
      sources: IDL.Vec(IDL.Text),
    }),
    NoAttributes: IDL.Null,
    UnknownNonce: IDL.Null,
    UntrustedSsoSource: IDL.Record({ domain: IDL.Text }),
    MissingField: IDL.Text,
    FrontendOriginMismatch: IDL.Record({
      got: IDL.Text,
      expected: IDL.Vec(IDL.Text),
    }),
  });
  const Result = IDL.Variant({ ok: IDL.Null, err: Error });
  const UserRole = IDL.Variant({
    admin: IDL.Null,
    user: IDL.Null,
    guest: IDL.Null,
  });
  const ProfileIdentity = IDL.Record({
    email: IDL.Text,
    fullName: IDL.Text,
    linkedin: IDL.Text,
    location: IDL.Text,
    phone: IDL.Text,
    portfolio: IDL.Text,
  });
  const WorkExperience = IDL.Record({
    company: IDL.Text,
    endDate: IDL.Text,
    highlights: IDL.Vec(IDL.Text),
    startDate: IDL.Text,
    title: IDL.Text,
  });
  const Project = IDL.Record({
    highlights: IDL.Vec(IDL.Text),
    name: IDL.Text,
    summary: IDL.Text,
    url: IDL.Text,
  });
  const LivingProfile = IDL.Record({
    education: IDL.Vec(IDL.Text),
    experience: IDL.Vec(WorkExperience),
    headline: IDL.Text,
    identity: ProfileIdentity,
    preferences: IDL.Vec(IDL.Text),
    projects: IDL.Vec(Project),
    skills: IDL.Vec(IDL.Text),
    summary: IDL.Text,
    updatedAt: IDL.Int,
  });
  const AnswerBankEntry = IDL.Record({
    answer: IDL.Text,
    id: IDL.Nat,
    kind: IDL.Text,
    prompt: IDL.Text,
    sensitive: IDL.Bool,
    updatedAt: IDL.Int,
  });
  const ApplicationRecord = IDL.Record({
    company: IDL.Text,
    createdAt: IDL.Int,
    id: IDL.Nat,
    platform: IDL.Text,
    status: IDL.Text,
    title: IDL.Text,
    updatedAt: IDL.Int,
    url: IDL.Text,
    usedAnswerIds: IDL.Vec(IDL.Nat),
  });
  const DraftJobContext = IDL.Record({
    company: IDL.Text,
    description: IDL.Text,
    title: IDL.Text,
  });
  const DetectedField = IDL.Record({
    ariaLabel: IDL.Text,
    fieldType: IDL.Text,
    id: IDL.Text,
    fieldLabel: IDL.Text,
    name: IDL.Text,
    placeholder: IDL.Text,
    tagName: IDL.Text,
  });
  const DraftRequest = IDL.Record({
    fields: IDL.Vec(DetectedField),
    job: DraftJobContext,
    mode: IDL.Text,
    pageTitle: IDL.Text,
    platform: IDL.Text,
    url: IDL.Text,
  });
  const FieldSuggestion = IDL.Record({
    confidence: IDL.Nat,
    fieldId: IDL.Text,
    kind: IDL.Text,
    fieldLabel: IDL.Text,
    requiresReview: IDL.Bool,
    source: IDL.Text,
    value: IDL.Text,
  });
  const DraftResponse = IDL.Record({
    createdAt: IDL.Int,
    id: IDL.Nat,
    mode: IDL.Text,
    platform: IDL.Text,
    suggestions: IDL.Vec(FieldSuggestion),
    url: IDL.Text,
  });

  return IDL.Service({
    __accessControlState: IDL.Func([], [IDL.Reserved], ["query"]),
    __answersState: IDL.Func([], [IDL.Reserved], ["query"]),
    __applicationsState: IDL.Func([], [IDL.Reserved], ["query"]),
    __draftsState: IDL.Func([], [IDL.Reserved], ["query"]),
    __profileState: IDL.Func([], [IDL.Reserved], ["query"]),
    _initialize_access_control: IDL.Func([], [], []),
    _internet_identity_sign_in_finish: IDL.Func([], [Result], []),
    _internet_identity_sign_in_start: IDL.Func([], [IDL.Vec(IDL.Nat8)], []),
    assignCallerUserRole: IDL.Func([IDL.Principal, UserRole], [], []),
    createApplication: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Vec(IDL.Nat)],
      [ApplicationRecord],
      [],
    ),
    createDraft: IDL.Func([DraftRequest], [DraftResponse], []),
    getCallerUserRole: IDL.Func([], [UserRole], ["query"]),
    getExtensionContractVersion: IDL.Func([], [IDL.Text], ["query"]),
    getProfile: IDL.Func([], [IDL.Opt(LivingProfile)], ["query"]),
    isCallerAdmin: IDL.Func([], [IDL.Bool], ["query"]),
    listAnswers: IDL.Func([], [IDL.Vec(AnswerBankEntry)], ["query"]),
    listApplications: IDL.Func([], [IDL.Vec(ApplicationRecord)], ["query"]),
    recentDrafts: IDL.Func([], [IDL.Vec(DraftResponse)], ["query"]),
    saveAnswer: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Bool], [AnswerBankEntry], []),
    saveProfile: IDL.Func([LivingProfile], [LivingProfile], []),
  });
};

export const init = ({ IDL }) => {
  return [];
};
