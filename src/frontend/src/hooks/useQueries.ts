import { createActor } from "@/backend";
import type {
  AnswerBankEntry,
  ApplicationRecord,
  DraftRequest,
  DraftResponse,
  LivingProfile,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetProfile() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<LivingProfile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: LivingProfile): Promise<LivingProfile> => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useListAnswers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<AnswerBankEntry[]>({
    queryKey: ["answers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAnswers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveAnswer() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      kind: string;
      prompt: string;
      answer: string;
      sensitive: boolean;
    }): Promise<AnswerBankEntry> => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveAnswer(
        input.kind,
        input.prompt,
        input.answer,
        input.sensitive,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["answers"] });
    },
  });
}

export function useCreateDraft() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (request: DraftRequest): Promise<DraftResponse> => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createDraft(request);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["drafts"] });
    },
  });
}

export function useCreateApplication() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      company: string;
      title: string;
      url: string;
      platform: string;
      status: string;
      usedAnswerIds: bigint[];
    }): Promise<ApplicationRecord> => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createApplication(
        input.company,
        input.title,
        input.url,
        input.platform,
        input.status,
        input.usedAnswerIds,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

export function useListApplications() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ApplicationRecord[]>({
    queryKey: ["applications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApplications();
    },
    enabled: !!actor && !isFetching,
  });
}
