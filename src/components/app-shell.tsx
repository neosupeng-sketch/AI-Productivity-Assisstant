import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  ListChecks,
  Search,
  MessageSquare,
  Menu,
  Sparkles,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Meeting Notes", icon: NotebookPen },
  { to: "/planner", label: "Task Planner", icon: ListChecks },
  { to: "/research", label: "Research", icon: Search },
  { to: "/chat", label: "AI Assistant", icon: MessageSquare },
] as const;

function NavList({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <nav className="flex-1 space-y-1 px-4">
      {navItems.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-shell-muted transition-colors hover:bg-shell-foreground/5 hover:text-shell-foreground"
          activeProps={{
            className:
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium bg-shell-foreground/10 text-shell-foreground",
          }}
        >
          <Icon className="size-4 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col bg-shell">
      <div className="p-6">
        <Link to="/" onClick={onNavigate} className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-lg bg-brand text-brand-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className="font-display text-lg tracking-tight text-shell-foreground">
            NexusAI
          </span>
        </Link>
      </div>
      <div className="mt-2 flex-1 overflow-y-auto">
        <NavList onNavigate={onNavigate} />
      </div>
      <div className="border-t border-shell-foreground/10 p-4">
        <div className="flex items-center gap-3 p-2">
          <span className="grid size-10 place-items-center rounded-full bg-shell-foreground/10 text-xs font-semibold text-shell-foreground">
            SC
          </span>
          <div>
            <p className="text-xs font-semibold text-shell-foreground">Sarah Chen</p>
            <p className="text-[10px] text-shell-muted">Pro Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-64">
          <SidebarInner />
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col gap-4 p-5 sm:p-8 md:flex-row md:items-end md:justify-between">
          <div className="flex items-start gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className="mt-1 rounded-lg border border-border bg-surface p-2 lg:hidden">
                <Menu className="size-4" />
                <span className="sr-only">Open navigation</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 border-0 p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarInner onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="font-display text-2xl tracking-tight sm:text-3xl">{title}</h1>
              {description ? (
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </header>
        <div className="flex-1 px-5 pb-10 sm:px-8">{children}</div>
      </main>
    </div>
  );
}
