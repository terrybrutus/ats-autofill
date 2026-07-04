import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useGenerateAnswer,
  useGetProfile,
  useRecentAnswers,
  useSaveProfile,
} from "@/hooks/useQueries";
import type { GeneratedAnswer } from "@/types";
import { Check, Copy, FileText, Loader2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function formatTimestamp(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  const d = new Date(ms);
  const now = Date.now();
  const diff = now - ms;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function CopyButton({ text, ocid }: { text: string; ocid: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy");
    }
  };
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handle}
      data-ocid={ocid}
      className="gap-1.5 transition-smooth"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-primary" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

function ProfilePanel() {
  const { data: profile, isLoading } = useGetProfile();
  const saveProfile = useSaveProfile();
  const [text, setText] = useState<string>("");
  const [dirty, setDirty] = useState(false);

  // Sync backend profile data to local state once loaded
  useEffect(() => {
    if (profile && !dirty && profile.text) {
      setText(profile.text);
    }
  }, [profile, dirty]);

  const charCount = text.length;
  const hasProfile = !!profile?.text;

  const handleSave = () => {
    saveProfile.mutate(text, {
      onSuccess: () => {
        setDirty(false);
        toast.success("Profile saved");
      },
      onError: () => toast.error("Could not save profile"),
    });
  };

  return (
    <Card className="bg-card border-border shadow-subtle h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" />
            Your profile
          </CardTitle>
          {hasProfile && !dirty && (
            <Badge variant="secondary" className="font-normal">
              Saved
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Paste your resume or professional profile once. We'll draw every
          answer from this.
        </p>
        {isLoading ? (
          <Skeleton className="h-48 w-full rounded-md" />
        ) : (
          <Textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setDirty(true);
            }}
            placeholder="Paste your resume, work history, skills, and accomplishments here…"
            className="min-h-48 resize-y font-body text-sm leading-relaxed"
            data-ocid="profile.input"
          />
        )}
        <div className="flex items-center justify-between">
          <span
            className="text-xs text-muted-foreground tabular-nums"
            data-ocid="profile.char_count"
          >
            {charCount.toLocaleString()} characters
          </span>
          <Button
            onClick={handleSave}
            disabled={!dirty || saveProfile.isPending}
            data-ocid="profile.save_button"
            className="gap-1.5 transition-smooth"
          >
            {saveProfile.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : null}
            Save profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AnswerPanel() {
  const generate = useGenerateAnswer();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<GeneratedAnswer | null>(null);

  const handleGenerate = () => {
    if (!question.trim()) return;
    generate.mutate(question, {
      onSuccess: (res) => {
        setAnswer(res);
        toast.success("Answer generated");
      },
      onError: () => toast.error("Could not generate answer"),
    });
  };

  return (
    <Card className="bg-card border-border shadow-subtle">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" />
          Question &amp; answer
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Paste an application question or ATS form field here…"
          className="min-h-24 resize-y font-body text-sm leading-relaxed"
          data-ocid="question.input"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {question.trim()
              ? "Ready to generate"
              : "Enter a question to begin"}
          </span>
          <Button
            onClick={handleGenerate}
            disabled={!question.trim() || generate.isPending}
            data-ocid="question.generate_button"
            className="gap-1.5 transition-smooth"
          >
            {generate.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            Generate answer
          </Button>
        </div>

        {generate.isPending ? (
          <Skeleton
            className="h-32 w-full rounded-md"
            data-ocid="answer.loading_state"
          />
        ) : answer ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-lg border border-border bg-muted/30 p-4"
            data-ocid="answer.output"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Suggested answer
              </span>
              <CopyButton text={answer.answer} ocid="answer.copy_button" />
            </div>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
              {answer.answer}
            </p>
          </motion.div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function RecentAnswers() {
  const { data, isLoading } = useRecentAnswers();
  const items = (data ?? []).slice(0, 5);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <Card className="bg-card border-border shadow-subtle">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent answers</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-14 w-full rounded-md" />
            <Skeleton className="h-14 w-full rounded-md" />
            <Skeleton className="h-14 w-full rounded-md" />
          </div>
        ) : items.length === 0 ? (
          <div
            className="text-sm text-muted-foreground py-6 text-center"
            data-ocid="recent.empty_state"
          >
            No answers yet. Generate your first one above.
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((a, i) => (
              <li key={a.id.toString()} data-ocid={`recent.item.${i + 1}`}>
                <button
                  type="button"
                  onClick={() => handleCopy(a.answer)}
                  className="group w-full text-left rounded-md border border-border bg-background p-3 cursor-pointer hover:border-primary/40 hover:bg-muted/30 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-foreground line-clamp-1 min-w-0 flex-1">
                      {a.question}
                    </p>
                    <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                      {formatTimestamp(a.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                    {a.answer}
                  </p>
                  <span className="text-[11px] text-muted-foreground/70 mt-1.5 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
                    <Copy className="h-3 w-3" /> Click to copy
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default function App() {
  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div
            className="lg:sticky lg:top-8 lg:self-start"
            data-ocid="profile.panel"
          >
            <ProfilePanel />
          </div>
          <div className="flex flex-col gap-6" data-ocid="workspace.panel">
            <AnswerPanel />
            <RecentAnswers />
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
