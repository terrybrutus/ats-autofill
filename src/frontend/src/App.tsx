import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateApplication,
  useCreateDraft,
  useGetProfile,
  useListAnswers,
  useListApplications,
  useListScanCaptures,
  useSaveAnswer,
  useSaveProfile,
} from "@/hooks/useQueries";
import type { DraftResponse, LivingProfile } from "@/types";
import {
  BriefcaseBusiness,
  Database,
  FileSearch,
  FileText,
  Loader2,
  PlugZap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useId, useMemo, useState } from "react";
import { toast } from "sonner";

const splitLines = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const joinLines = (value: string[]) => value.join("\n");

const nowNs = () => BigInt(Date.now()) * 1_000_000n;

const emptyProfile = (): LivingProfile => ({
  identity: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
  },
  headline: "",
  summary: "",
  skills: [],
  experience: [],
  projects: [],
  education: [],
  preferences: [],
  updatedAt: nowNs(),
});

function formatTime(ns: bigint) {
  if (ns === 0n) return "not saved";
  return new Date(Number(ns / 1_000_000n)).toLocaleString();
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      <span>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-10 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-smooth focus-visible:ring-2 focus-visible:ring-ring"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const id = useId();
  return (
    <div className="grid gap-1.5 text-sm font-medium">
      <label htmlFor={id}>{label}</label>
      <Textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="resize-y text-sm leading-relaxed"
      />
    </div>
  );
}

function ProfileWorkspace() {
  const { data, isLoading } = useGetProfile();
  const saveProfile = useSaveProfile();
  const [profile, setProfile] = useState<LivingProfile>(emptyProfile);
  const [skillsText, setSkillsText] = useState("");
  const [educationText, setEducationText] = useState("");
  const [preferencesText, setPreferencesText] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!data || dirty) return;
    setProfile(data);
    setSkillsText(joinLines(data.skills));
    setEducationText(joinLines(data.education));
    setPreferencesText(joinLines(data.preferences));
  }, [data, dirty]);

  const updateProfile = (next: LivingProfile) => {
    setProfile(next);
    setDirty(true);
  };

  const handleSave = () => {
    const payload = {
      ...profile,
      skills: splitLines(skillsText),
      education: splitLines(educationText),
      preferences: splitLines(preferencesText),
      updatedAt: nowNs(),
    };
    saveProfile.mutate(payload, {
      onSuccess: (saved) => {
        setProfile(saved);
        setDirty(false);
        toast.success("Living resume saved");
      },
      onError: () => toast.error("Could not save living resume"),
    });
  };

  return (
    <Card className="border-border bg-card shadow-subtle">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" />
            Living resume
          </CardTitle>
          <Badge variant="secondary" className="font-normal">
            {dirty ? "Unsaved" : `Updated ${formatTime(profile.updatedAt)}`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isLoading ? (
          <Skeleton className="h-80 w-full rounded-md" />
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Full name"
                value={profile.identity.fullName}
                onChange={(fullName) =>
                  updateProfile({
                    ...profile,
                    identity: { ...profile.identity, fullName },
                  })
                }
              />
              <Field
                label="Email"
                value={profile.identity.email}
                onChange={(email) =>
                  updateProfile({
                    ...profile,
                    identity: { ...profile.identity, email },
                  })
                }
              />
              <Field
                label="Phone"
                value={profile.identity.phone}
                onChange={(phone) =>
                  updateProfile({
                    ...profile,
                    identity: { ...profile.identity, phone },
                  })
                }
              />
              <Field
                label="Location"
                value={profile.identity.location}
                onChange={(location) =>
                  updateProfile({
                    ...profile,
                    identity: { ...profile.identity, location },
                  })
                }
              />
              <Field
                label="LinkedIn"
                value={profile.identity.linkedin}
                onChange={(linkedin) =>
                  updateProfile({
                    ...profile,
                    identity: { ...profile.identity, linkedin },
                  })
                }
              />
              <Field
                label="Portfolio"
                value={profile.identity.portfolio}
                onChange={(portfolio) =>
                  updateProfile({
                    ...profile,
                    identity: { ...profile.identity, portfolio },
                  })
                }
              />
            </div>
            <Field
              label="Headline"
              value={profile.headline}
              onChange={(headline) => updateProfile({ ...profile, headline })}
              placeholder="Frontend/product engineer building AI-assisted workflows"
            />
            <TextAreaField
              label="Professional summary"
              value={profile.summary}
              onChange={(summary) => updateProfile({ ...profile, summary })}
              placeholder="Write the canonical profile summary the extension should draft from."
              rows={6}
            />
            <div className="grid gap-3 md:grid-cols-3">
              <TextAreaField
                label="Skills"
                value={skillsText}
                onChange={(value) => {
                  setSkillsText(value);
                  setDirty(true);
                }}
                placeholder="React&#10;TypeScript&#10;AI workflows"
                rows={5}
              />
              <TextAreaField
                label="Education / certs"
                value={educationText}
                onChange={(value) => {
                  setEducationText(value);
                  setDirty(true);
                }}
                rows={5}
              />
              <TextAreaField
                label="Work preferences"
                value={preferencesText}
                onChange={(value) => {
                  setPreferencesText(value);
                  setDirty(true);
                }}
                placeholder="Remote preferred&#10;US authorized&#10;No sponsorship required"
                rows={5}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={!dirty || saveProfile.isPending}
              >
                {saveProfile.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save living resume
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function AnswerBank() {
  const { data: answers = [], isLoading } = useListAnswers();
  const saveAnswer = useSaveAnswer();
  const [kind, setKind] = useState("workAuthorization");
  const [prompt, setPrompt] = useState(
    "Are you authorized to work in the United States?",
  );
  const [answer, setAnswer] = useState("Yes");
  const [sensitive, setSensitive] = useState(true);

  const handleSave = () => {
    saveAnswer.mutate(
      { kind, prompt, answer, sensitive },
      {
        onSuccess: () => toast.success("Approved answer saved"),
        onError: () => toast.error("Could not save answer"),
      },
    );
  };

  return (
    <Card className="border-border bg-card shadow-subtle">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Approved answer bank
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Field kind" value={kind} onChange={setKind} />
          <label className="flex items-center gap-2 self-end rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={sensitive}
              onChange={(event) => setSensitive(event.target.checked)}
            />
            Manual-review sensitive answer
          </label>
        </div>
        <TextAreaField
          label="Prompt / field question"
          value={prompt}
          onChange={setPrompt}
          rows={3}
        />
        <TextAreaField
          label="Approved answer"
          value={answer}
          onChange={setAnswer}
          rows={3}
        />
        <Button
          onClick={handleSave}
          disabled={!kind.trim() || !answer.trim() || saveAnswer.isPending}
          className="justify-self-end"
        >
          {saveAnswer.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Save answer
        </Button>
        {isLoading ? (
          <Skeleton className="h-28 w-full rounded-md" />
        ) : (
          <ul className="grid gap-2">
            {answers.map((item) => (
              <li
                key={item.id.toString()}
                className="rounded-md border border-border p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-sm">{item.kind}</strong>
                  {item.sensitive ? (
                    <Badge variant="secondary">Review</Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.prompt}
                </p>
                <p className="mt-2 text-sm">{item.answer}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function DraftLab() {
  const createDraft = useCreateDraft();
  const [draft, setDraft] = useState<DraftResponse | null>(null);
  const [mode, setMode] = useState("approved-answer");
  const [description, setDescription] = useState("");

  const request = useMemo(
    () => ({
      url: "https://boards.greenhouse.io/example/jobs/123",
      pageTitle: "Frontend Engineer - Example Co",
      platform: "greenhouse",
      mode,
      job: {
        company: "Example Co",
        title: "Frontend Engineer",
        description,
      },
      fields: [
        {
          id: "name",
          name: "name",
          fieldLabel: "Full name",
          placeholder: "",
          ariaLabel: "",
          tagName: "input",
          fieldType: "text",
        },
        {
          id: "email",
          name: "email",
          fieldLabel: "Email",
          placeholder: "",
          ariaLabel: "",
          tagName: "input",
          fieldType: "email",
        },
        {
          id: "sponsorship",
          name: "sponsorship",
          fieldLabel: "Will you require sponsorship?",
          placeholder: "",
          ariaLabel: "",
          tagName: "select",
          fieldType: "select",
        },
        {
          id: "interest",
          name: "interest",
          fieldLabel: "Why are you interested in this role?",
          placeholder: "",
          ariaLabel: "",
          tagName: "textarea",
          fieldType: "textarea",
        },
      ],
    }),
    [description, mode],
  );

  const handleDraft = () => {
    createDraft.mutate(request, {
      onSuccess: (result) => {
        setDraft(result);
        toast.success("Draft created");
      },
      onError: () => toast.error("Could not create draft"),
    });
  };

  return (
    <Card className="border-border bg-card shadow-subtle">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <PlugZap className="h-4 w-4 text-primary" />
          Extension draft contract
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-[180px_1fr_auto]">
          <label className="grid gap-1.5 text-sm font-medium">
            Mode
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value)}
              className="min-h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="approved-answer">Approved answers</option>
              <option value="tailored-draft">Tailored draft</option>
            </select>
          </label>
          <TextAreaField
            label="Optional job description context"
            value={description}
            onChange={setDescription}
            rows={2}
          />
          <Button
            onClick={handleDraft}
            disabled={createDraft.isPending}
            className="self-end"
          >
            {createDraft.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Create draft
          </Button>
        </div>
        {draft ? (
          <div className="grid gap-2">
            {draft.suggestions.map((suggestion) => (
              <div
                key={suggestion.fieldId}
                className="grid gap-2 rounded-md border border-border bg-muted/20 p-3 sm:grid-cols-[1fr_1fr_auto]"
              >
                <div>
                  <p className="text-sm font-semibold">{suggestion.fieldLabel}</p>
                  <p className="text-xs text-muted-foreground">
                    {suggestion.kind} · {suggestion.source}
                  </p>
                </div>
                <p className="text-sm">
                  {suggestion.value || "No draft value"}
                </p>
                <Badge
                  variant={suggestion.requiresReview ? "secondary" : "default"}
                >
                  {suggestion.requiresReview
                    ? "Review"
                    : `${suggestion.confidence.toString()}%`}
                </Badge>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ApplicationTracker() {
  const { data: applications = [], isLoading } = useListApplications();
  const createApplication = useCreateApplication();

  const seedApplication = () => {
    createApplication.mutate(
      {
        company: "Example Co",
        title: "Frontend Engineer",
        url: "https://boards.greenhouse.io/example/jobs/123",
        platform: "greenhouse",
        status: "draft",
        usedAnswerIds: [],
      },
      {
        onSuccess: () => toast.success("Application saved"),
        onError: () => toast.error("Could not save application"),
      },
    );
  };

  return (
    <Card className="border-border bg-card shadow-subtle">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BriefcaseBusiness className="h-4 w-4 text-primary" />
            Application tracker
          </CardTitle>
          <Button variant="outline" size="sm" onClick={seedApplication}>
            Add sample
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-24 w-full rounded-md" />
        ) : applications.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Filled applications will be saved here with company, role, ATS
            platform, and answer IDs.
          </p>
        ) : (
          <ul className="grid gap-2">
            {applications.map((app) => (
              <li
                key={app.id.toString()}
                className="rounded-md border border-border p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-sm">{app.title}</strong>
                  <Badge variant="secondary">{app.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {app.company} · {app.platform}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function ScanCaptureLog() {
  const { data: captures = [], isLoading } = useListScanCaptures();

  return (
    <Card className="border-border bg-card shadow-subtle">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileSearch className="h-4 w-4 text-primary" />
          ATS scan captures
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-24 w-full rounded-md" />
        ) : captures.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Extension scans saved for adapter tuning will appear here.
          </p>
        ) : (
          <ul className="grid gap-2">
            {captures.map((capture) => (
              <li
                key={capture.id.toString()}
                className="rounded-md border border-border p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{capture.pageTitle || capture.url}</p>
                  <Badge variant="outline">{capture.platform}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {capture.fields.length} fields - {capture.suggestions.length} suggestions - {formatTime(capture.createdAt)}
                </p>
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
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid gap-6"
        >
          <ProfileWorkspace />
          <DraftLab />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="grid content-start gap-6"
        >
          <Card className="border-border bg-card shadow-subtle">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Database className="h-4 w-4 text-primary" />
                Source of truth
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              The Chrome extension scans ATS forms. This Caffeine app stores the
              living resume, approved answers, draft contract, and application
              history it should use.
            </CardContent>
          </Card>
          <AnswerBank />
          <ScanCaptureLog />
          <ApplicationTracker />
        </motion.div>
      </div>
    </Layout>
  );
}
