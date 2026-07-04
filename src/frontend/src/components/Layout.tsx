import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const year = new Date().getFullYear();
  const host =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";
  const brandUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${host}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-card border-b border-border shadow-subtle">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-5 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-display font-semibold text-lg">
            A
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
              ATS Autofill
            </h1>
            <p className="text-sm text-muted-foreground truncate">
              Paste once. Answer every application question in seconds.
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-background">{children}</main>

      <footer className="bg-muted/40 border-t border-border">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
            Answers are suggestions generated from your profile — always review
            for accuracy and tone before submitting an application.
          </p>
          <p className="text-xs text-muted-foreground shrink-0">
            © {year}. Built with love using{" "}
            <a
              href={brandUrl}
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline-offset-2 hover:underline transition-smooth"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
