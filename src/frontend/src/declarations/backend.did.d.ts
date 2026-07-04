/* eslint-disable */
// @ts-nocheck

import type { ActorMethod } from "@icp-sdk/core/agent";
import type { IDL } from "@icp-sdk/core/candid";
import type { Principal } from "@icp-sdk/core/principal";

export type Error = { FrontendOriginsNotConfigured: null } |
  { MixedSsoSources: { otherKeys: Array<string>; ssoKeys: Array<string> } } |
  { Stale: { ageNs: bigint } } |
  { MalformedCandid: null } |
  { AmbiguousAttribute: { field: string; sources: Array<string> } } |
  { NoAttributes: null } |
  { UnknownNonce: null } |
  { UntrustedSsoSource: { domain: string } } |
  { MissingField: string } |
  { FrontendOriginMismatch: { got: string; expected: Array<string> } };
export type Result = { ok: null } | { err: Error };
export type UserRole = { admin: null } | { user: null } | { guest: null };

export interface ProfileIdentity {
  email: string;
  fullName: string;
  linkedin: string;
  location: string;
  phone: string;
  portfolio: string;
}
export interface WorkExperience {
  company: string;
  endDate: string;
  highlights: Array<string>;
  startDate: string;
  title: string;
}
export interface Project {
  highlights: Array<string>;
  name: string;
  summary: string;
  url: string;
}
export interface LivingProfile {
  education: Array<string>;
  experience: Array<WorkExperience>;
  headline: string;
  identity: ProfileIdentity;
  preferences: Array<string>;
  projects: Array<Project>;
  skills: Array<string>;
  summary: string;
  updatedAt: bigint;
}
export interface AnswerBankEntry {
  answer: string;
  id: bigint;
  kind: string;
  prompt: string;
  sensitive: boolean;
  updatedAt: bigint;
}
export interface ApplicationRecord {
  company: string;
  createdAt: bigint;
  id: bigint;
  platform: string;
  status: string;
  title: string;
  updatedAt: bigint;
  url: string;
  usedAnswerIds: Array<bigint>;
}
export interface DraftJobContext {
  company: string;
  description: string;
  title: string;
}
export interface DetectedField {
  ariaLabel: string;
  fieldType: string;
  id: string;
  fieldLabel: string;
  name: string;
  placeholder: string;
  tagName: string;
}
export interface DraftRequest {
  fields: Array<DetectedField>;
  job: DraftJobContext;
  mode: string;
  pageTitle: string;
  platform: string;
  url: string;
}
export interface FieldSuggestion {
  confidence: bigint;
  fieldId: string;
  kind: string;
  fieldLabel: string;
  requiresReview: boolean;
  source: string;
  value: string;
}
export interface DraftResponse {
  createdAt: bigint;
  id: bigint;
  mode: string;
  platform: string;
  suggestions: Array<FieldSuggestion>;
  url: string;
}

export interface _SERVICE {
  __accessControlState: ActorMethod<[], any>;
  __answersState: ActorMethod<[], any>;
  __applicationsState: ActorMethod<[], any>;
  __draftsState: ActorMethod<[], any>;
  __profileState: ActorMethod<[], any>;
  _initialize_access_control: ActorMethod<[], undefined>;
  _internet_identity_sign_in_finish: ActorMethod<[], Result>;
  _internet_identity_sign_in_start: ActorMethod<[], Uint8Array>;
  assignCallerUserRole: ActorMethod<[Principal, UserRole], undefined>;
  createApplication: ActorMethod<[string, string, string, string, string, Array<bigint>], ApplicationRecord>;
  createDraft: ActorMethod<[DraftRequest], DraftResponse>;
  getCallerUserRole: ActorMethod<[], UserRole>;
  getExtensionContractVersion: ActorMethod<[], string>;
  getProfile: ActorMethod<[], [] | [LivingProfile]>;
  isCallerAdmin: ActorMethod<[], boolean>;
  listAnswers: ActorMethod<[], Array<AnswerBankEntry>>;
  listApplications: ActorMethod<[], Array<ApplicationRecord>>;
  recentDrafts: ActorMethod<[], Array<DraftResponse>>;
  saveAnswer: ActorMethod<[string, string, string, boolean], AnswerBankEntry>;
  saveProfile: ActorMethod<[LivingProfile], LivingProfile>;
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
