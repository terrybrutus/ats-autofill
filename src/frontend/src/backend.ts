/* eslint-disable */
// @ts-nocheck

import { Actor, HttpAgent, type ActorConfig, type Agent, type ActorSubclass, type HttpAgentOptions } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";
import { ExternalBlob } from "@caffeineai/object-storage";
import { idlFactory, type _SERVICE } from "./declarations/backend.did";
import type {
  AnswerBankEntry,
  ApplicationRecord,
  DraftRequest,
  DraftResponse,
  FieldSuggestion,
  LivingProfile,
  ScanCapture,
} from "./types";

export { ExternalBlob } from "@caffeineai/object-storage";

export enum UserRole {
  admin = "admin",
  user = "user",
  guest = "guest",
}

export type Error_ =
  | { __kind__: "FrontendOriginsNotConfigured"; FrontendOriginsNotConfigured: null }
  | { __kind__: "MalformedCandid"; MalformedCandid: null }
  | { __kind__: "MissingField"; MissingField: string }
  | { __kind__: "UnknownNonce"; UnknownNonce: null }
  | { __kind__: "NoAttributes"; NoAttributes: null }
  | { __kind__: "Stale"; Stale: { ageNs: bigint } }
  | { __kind__: "FrontendOriginMismatch"; FrontendOriginMismatch: { got: string; expected: string[] } }
  | { __kind__: "MixedSsoSources"; MixedSsoSources: { otherKeys: string[]; ssoKeys: string[] } }
  | { __kind__: "AmbiguousAttribute"; AmbiguousAttribute: { field: string; sources: string[] } }
  | { __kind__: "UntrustedSsoSource"; UntrustedSsoSource: { domain: string } };

export type Result = { __kind__: "ok"; ok: null } | { __kind__: "err"; err: Error_ };

export interface backendInterface {
  __accessControlState(): Promise<any>;
  __answersState(): Promise<any>;
  __applicationsState(): Promise<any>;
  __draftsState(): Promise<any>;
  __profileState(): Promise<any>;
  __scanCapturesState(): Promise<any>;
  _initialize_access_control(): Promise<void>;
  _internet_identity_sign_in_finish(): Promise<Result>;
  _internet_identity_sign_in_start(): Promise<Uint8Array>;
  assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
  createApplication(
    company: string,
    title: string,
    url: string,
    platform: string,
    status: string,
    usedAnswerIds: bigint[],
  ): Promise<ApplicationRecord>;
  createDraft(request: DraftRequest): Promise<DraftResponse>;
  getCallerUserRole(): Promise<UserRole>;
  getExtensionContractVersion(): Promise<string>;
  getProfile(): Promise<LivingProfile | null>;
  isCallerAdmin(): Promise<boolean>;
  listAnswers(): Promise<AnswerBankEntry[]>;
  listApplications(): Promise<ApplicationRecord[]>;
  listScanCaptures(): Promise<ScanCapture[]>;
  recentDrafts(): Promise<DraftResponse[]>;
  saveAnswer(kind: string, prompt: string, answer: string, sensitive: boolean): Promise<AnswerBankEntry>;
  saveProfile(profile: LivingProfile): Promise<LivingProfile>;
  saveScanCapture(request: DraftRequest, suggestions: FieldSuggestion[]): Promise<ScanCapture>;
}

const fromCandidRole = (value: { admin?: null; user?: null; guest?: null }): UserRole =>
  "admin" in value ? UserRole.admin : "user" in value ? UserRole.user : UserRole.guest;

const toCandidRole = (value: UserRole) =>
  value === UserRole.admin
    ? { admin: null }
    : value === UserRole.user
      ? { user: null }
      : { guest: null };

const unwrapOpt = <T,>(value: [] | [T]): T | null => (value.length === 0 ? null : value[0]);

export class Backend implements backendInterface {
  constructor(
    private actor: ActorSubclass<_SERVICE>,
    private _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
    private _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>,
    private processError?: (error: unknown) => never,
  ) {}

  private async call<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.processError) return fn();
    try {
      return await fn();
    } catch (error) {
      this.processError(error);
      throw new Error("unreachable");
    }
  }

  __accessControlState(): Promise<any> {
    return this.call(() => this.actor.__accessControlState());
  }

  __answersState(): Promise<any> {
    return this.call(() => this.actor.__answersState());
  }

  __applicationsState(): Promise<any> {
    return this.call(() => this.actor.__applicationsState());
  }

  __draftsState(): Promise<any> {
    return this.call(() => this.actor.__draftsState());
  }

  __profileState(): Promise<any> {
    return this.call(() => this.actor.__profileState());
  }

  __scanCapturesState(): Promise<any> {
    return this.call(() => this.actor.__scanCapturesState());
  }

  _initialize_access_control(): Promise<void> {
    return this.call(() => this.actor._initialize_access_control());
  }

  _internet_identity_sign_in_finish(): Promise<Result> {
    return this.call(() => this.actor._internet_identity_sign_in_finish() as Promise<Result>);
  }

  _internet_identity_sign_in_start(): Promise<Uint8Array> {
    return this.call(() => this.actor._internet_identity_sign_in_start());
  }

  assignCallerUserRole(user: Principal, role: UserRole): Promise<void> {
    return this.call(() => this.actor.assignCallerUserRole(user, toCandidRole(role)));
  }

  createApplication(
    company: string,
    title: string,
    url: string,
    platform: string,
    status: string,
    usedAnswerIds: bigint[],
  ): Promise<ApplicationRecord> {
    return this.call(() =>
      this.actor.createApplication(company, title, url, platform, status, usedAnswerIds),
    );
  }

  createDraft(request: DraftRequest): Promise<DraftResponse> {
    return this.call(() => this.actor.createDraft(request));
  }

  async getCallerUserRole(): Promise<UserRole> {
    return fromCandidRole(await this.call(() => this.actor.getCallerUserRole()));
  }

  getExtensionContractVersion(): Promise<string> {
    return this.call(() => this.actor.getExtensionContractVersion());
  }

  async getProfile(): Promise<LivingProfile | null> {
    return unwrapOpt(await this.call(() => this.actor.getProfile()));
  }

  isCallerAdmin(): Promise<boolean> {
    return this.call(() => this.actor.isCallerAdmin());
  }

  listAnswers(): Promise<AnswerBankEntry[]> {
    return this.call(() => this.actor.listAnswers());
  }

  listApplications(): Promise<ApplicationRecord[]> {
    return this.call(() => this.actor.listApplications());
  }

  listScanCaptures(): Promise<ScanCapture[]> {
    return this.call(() => this.actor.listScanCaptures());
  }

  recentDrafts(): Promise<DraftResponse[]> {
    return this.call(() => this.actor.recentDrafts());
  }

  saveAnswer(kind: string, prompt: string, answer: string, sensitive: boolean): Promise<AnswerBankEntry> {
    return this.call(() => this.actor.saveAnswer(kind, prompt, answer, sensitive));
  }

  saveProfile(profile: LivingProfile): Promise<LivingProfile> {
    return this.call(() => this.actor.saveProfile(profile));
  }

  saveScanCapture(request: DraftRequest, suggestions: FieldSuggestion[]): Promise<ScanCapture> {
    return this.call(() => this.actor.saveScanCapture(request, suggestions));
  }
}

export interface CreateActorOptions {
  agent?: Agent;
  agentOptions?: HttpAgentOptions;
  actorOptions?: ActorConfig;
  processError?: (error: unknown) => never;
}

export function createActor(
  canisterId: string,
  _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
  _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>,
  options: CreateActorOptions = {},
): Backend {
  const agent = options.agent || HttpAgent.createSync({ ...options.agentOptions });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions.");
  }
  const actor = Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
