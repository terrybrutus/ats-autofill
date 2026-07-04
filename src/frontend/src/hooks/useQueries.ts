import { createActor } from "@/backend";
import type { GeneratedAnswer, Profile } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetProfile() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Profile | null>({
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
    mutationFn: async (text: string) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.saveProfile(text);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useGenerateAnswer() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (question: string): Promise<GeneratedAnswer> => {
      if (!actor) throw new Error("Actor not ready");
      return actor.generateAnswer(question);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recentAnswers"] });
    },
  });
}

export function useRecentAnswers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<GeneratedAnswer[]>({
    queryKey: ["recentAnswers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.recentAnswers();
    },
    enabled: !!actor && !isFetching,
  });
}
