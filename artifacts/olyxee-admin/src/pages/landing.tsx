import { FC, useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  User,
  ChevronDown,
  Phone,
  MapPin,
  Loader2,
  Mail,
  Ship,
  Plane,
  Menu,
  X,
  ShieldCheck,
  Globe,
  Smartphone,
  LayoutDashboard,
  Users,
  Package,
  Wallet,
  Sun,
  Moon,
  ChevronsUpDown,
  Plus,
  Search,
  Building2,
} from "lucide-react";
import warehouseOperator from "@assets/warehouse-operator-web.jpg";
import airCargoImg from "@assets/air-cargo-web.jpg";
import oceanCargoImg from "@assets/ocean-cargo-web.jpg";
import { plans } from "@/lib/launch";
import { logisticsFlow, logisticsStatusLabel } from "@/lib/order-statuses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/status-badge";

const freighticsLogo = `${import.meta.env.BASE_URL}freightics-primary.png`;

// ─── Data ───────────────────────────────────────────────────────────────
const BUILT_FOR = [
  "Freight forwarders",
  "Customs clearing agents",
  "Cargo consolidators",
  "Import and export agents",
];

const PAIN_POINTS = [
  { pain: "Customers chase you for status", fix: "A branded tracking page answers for you." },
  { pain: "Job records live in five places", fix: "One record per job." },
  { pain: "Profit is a guess until month-end", fix: "Margin on every job, straight away." },
];

const DEMO_CUSTOMERS = [
  { name: "Cape Cargo Imports", initials: "CC", phone: "+27 83 902 7714", address: "Foreshore · Cape Town" },
];
const DEMO_DETAILS = ["Sea Freight · China → South Africa · 20 ft container"];
const DEMO_REFS = ["FSL-0023-2026"];

const FREE_PLAN_ITEMS = [
  "Customers, jobs and shipments",
  "Air and sea freight workflows",
  "Customer tracking and status updates",
  "Invoicing, costs and billing",
  "Margins and profit per job",
  "Quotes and landed-cost estimates",
  "Up to 100 status updates per month",
];

const STARTER_PRICE = `R${plans.free.price}`;
const SCALE_PRICE = `R${plans.business.price}`;
const SCALE_PREVIEW = (plans.business.comingSoon ?? []).slice(0, 4);

// ─── Helpers ────────────────────────────────────────────────────────────
const isCustomsStage = (code: string) => code.includes("CUSTOMS") || code.includes("VAT");

const ZAR = (n: number) => `R${n.toLocaleString("en-ZA").replace(/,/g, " ")}`;

// ─── Components ─────────────────────────────────────────────────────────

type GoTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;

const Nav: FC<{ open: boolean; setOpen: (v: boolean) => void; goTo: GoTo }> = ({ open, setOpen, goTo }) => (
  <header className="fixed top-0 inset-x-0 z-50 border-b border-neutral-200 bg-white">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2.5">
        <img src={freighticsLogo} alt="Freightics" className="h-9 w-9 object-contain" />
        <span className="text-[15px] font-bold tracking-tight text-neutral-950 font-ui">Freightics</span>
      </Link>

      <nav className="hidden md:flex items-center gap-7 font-ui">
        <Link href="/upgrade" className="text-[13px] font-medium text-neutral-600 hover:text-neutral-950 transition-colors">
          Pricing
        </Link>
        <Link href="/login?mode=signup" className="text-[13px] font-semibold px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors">
          Create workspace
        </Link>
      </nav>

      <button className="md:hidden text-neutral-600 hover:text-neutral-950" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
    </div>

    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="md:hidden absolute top-16 inset-x-0 border-b border-neutral-200 bg-white shadow-xl"
        >
          <div className="px-6 py-5 flex flex-col gap-4 font-ui">
            <Link href="/upgrade" className="text-base font-medium text-neutral-700" onClick={() => setOpen(false)}>Pricing</Link>
            <Link href="/login?mode=signup" className="text-base font-semibold text-red-600" onClick={() => setOpen(false)}>Create workspace</Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </header>
);

// A faithful miniature of the customer tracking page, driven by the product's
// real sea-freight stage list so the wording always matches the app.
const ShipmentCard: FC = () => {
  const flow = [...(logisticsFlow("SEA") ?? [])];
  const currentCode = "MID_OCEAN_TRANSIT";
  const current = flow.indexOf(currentCode);
  const visible = flow.slice(Math.max(0, current - 3), current + 4);
  const offset = Math.max(0, current - 3);

  return (
    <div className="relative mx-auto w-full max-w-[470px] lg:max-w-none">
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_28px_70px_-30px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-neutral-900 text-[11px] font-bold text-white">TB</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-neutral-950 font-ui">Table Bay Freight</p>
              <p className="text-[11px] text-neutral-500 font-ui">Customer tracking page</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600 font-ui">Sea freight</span>
        </div>

        <div className="p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400 font-ui">Tracking number</p>
          <p className="mt-1 font-code text-lg font-medium tracking-wide text-neutral-950">TBF-K7M-9X2A</p>

          <div className="mt-6">
            <div className="flex items-start justify-between font-ui">
              <div>
                <p className="text-sm font-semibold text-neutral-950">Shenzhen</p>
                <p className="text-[11px] text-neutral-500">CN · ETD 28 Oct</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-neutral-950">Durban</p>
                <p className="text-[11px] text-neutral-500">ZA · ETA 12 Dec</p>
              </div>
            </div>
            <div className="relative my-3 h-8">
              <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-neutral-300" />
              <div className="absolute left-0 top-1/2 w-[58%] border-t-2 border-red-600" />
              <span className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-red-600" />
              <span className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-neutral-300 bg-white" />
              <span className="absolute left-[58%] top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-red-600 text-white shadow-md">
                <Ship size={15} />
              </span>
            </div>
          </div>

          <div className="mt-2 rounded-lg bg-neutral-50 px-4 py-3 font-ui">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400">Current status</p>
            <p className="mt-0.5 text-[15px] font-semibold text-neutral-950">{logisticsStatusLabel(currentCode)}</p>
          </div>

          <ol className="mt-5">
            {visible.map((code, i) => {
              const idx = offset + i;
              const state = idx < current ? "done" : idx === current ? "current" : "next";
              return (
                <li key={code} className="relative flex items-center gap-3 py-[7px] font-ui">
                  {i < visible.length - 1 && <span aria-hidden className="absolute left-[8px] top-[26px] h-[calc(100%-12px)] w-px bg-neutral-200" />}
                  <span
                    className={`relative z-10 grid h-[17px] w-[17px] shrink-0 place-items-center rounded-full ${
                      state === "done" ? "bg-neutral-900 text-white" : state === "current" ? "border-2 border-red-600 bg-white" : "border border-neutral-300 bg-white"
                    }`}
                  >
                    {state === "done" && <Check size={10} strokeWidth={3.5} />}
                    {state === "current" && <span className="h-1.5 w-1.5 rounded-full bg-red-600" />}
                  </span>
                  <span className={`text-[13.5px] ${state === "current" ? "font-semibold text-neutral-950" : state === "done" ? "text-neutral-700" : "text-neutral-400"}`}>
                    {logisticsStatusLabel(code)}
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="mt-2 text-[11px] text-neutral-400 font-ui">Customs clearance and delivery follow.</p>
        </div>
      </div>
    </div>
  );
};

const HeroSection: FC<{ goTo: GoTo }> = ({ goTo }) => (
  <section className="relative isolate overflow-hidden bg-neutral-50 pt-28 pb-20 md:pt-36 md:pb-28">
    <img src={airCargoImg} alt="" aria-hidden className="absolute inset-0 -z-10 h-full w-full object-cover object-[60%_45%]" />
    <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-white via-white/90 to-white/10" />
    <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-white to-transparent" />

    <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1.05fr_1fr]">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="font-editorial text-[2.8rem] leading-[1.04] text-neutral-950 text-balance md:text-6xl lg:text-[4.1rem]">
          Run every cross-border freight job in one place.
        </h1>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center font-ui">
          <Link href="/login?mode=signup" className="group inline-flex items-center justify-center gap-2.5 rounded-md bg-red-600 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-700">
            Create your workspace
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a href="#workflow" onClick={(e) => goTo(e, "workflow")} className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-6 py-3.5 text-[15px] font-semibold text-neutral-900 transition-colors hover:border-neutral-400">
            See how a job moves
          </a>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
        <ShipmentCard />
      </motion.div>
    </div>
  </section>
);

const BuiltForStrip: FC = () => (
  <section className="border-y border-neutral-200 bg-white">
    <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-6 py-6 md:flex-row md:items-center md:gap-10">
      <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400 font-ui">Built for</p>
      <ul className="flex flex-wrap gap-x-9 gap-y-2 font-ui">
        {BUILT_FOR.map((item) => (
          <li key={item} className="text-[15px] font-semibold text-neutral-800">{item}</li>
        ))}
      </ul>
    </div>
  </section>
);

const ProblemSection: FC = () => (
  <section className="bg-neutral-50 py-20 md:py-28">
    <div className="mx-auto max-w-7xl px-6">
      <h2 className="max-w-3xl font-editorial text-4xl leading-[1.05] text-neutral-950 text-balance md:text-5xl">
        The cargo moves. The admin around it shouldn’t slow you down.
      </h2>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {PAIN_POINTS.map((p, i) => (
          <div key={p.pain} className="flex flex-col rounded-xl border border-neutral-200 bg-white p-7">
            <span className="font-code text-xs text-neutral-400">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-4 text-xl font-bold leading-snug text-neutral-950 font-ui">{p.pain}</h3>
            <div className="mt-6 flex items-start gap-2.5 border-t border-neutral-100 pt-5">
              <Check size={18} className="mt-0.5 shrink-0 text-red-600" strokeWidth={3} />
              <p className="text-[15px] font-medium leading-snug text-neutral-800 font-ui">{p.fix}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

type Mode = "SEA" | "AIR";

const WorkflowSection: FC = () => {
  const [mode, setMode] = useState<Mode>("SEA");
  const flow = [...(logisticsFlow(mode) ?? [])];

  const callouts = [
    { icon: ShieldCheck, title: "Shipment and billing tracked separately", body: "Prepaid or postpaid, per job." },
    { icon: Globe, title: "VAT & duty and customs built in", body: "Part of the flow, not an afterthought." },
    { icon: Smartphone, title: "Customers see confirmed stages", body: "On their tracking page, on any phone." },
  ];

  return (
    <section id="workflow" className="scroll-mt-16 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col justify-between gap-8 md:mb-14 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="font-editorial text-4xl leading-[1.05] text-neutral-950 text-balance md:text-5xl">
              Every stage of an air or sea job, in order.
            </h2>
          </div>

          <div role="tablist" aria-label="Transport mode" className="inline-flex shrink-0 self-start rounded-lg border border-neutral-200 bg-neutral-100 p-1 font-ui md:self-auto">
            {(["SEA", "AIR"] as Mode[]).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${mode === m ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-500 hover:text-neutral-800"}`}
              >
                {m === "SEA" ? <Ship size={16} /> : <Plane size={16} />}
                {m === "SEA" ? "Sea freight" : "Air freight"}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-neutral-200">
          <div className="relative h-40 md:h-52">
            <AnimatePresence mode="wait">
              <motion.img
                key={mode}
                src={mode === "SEA" ? oceanCargoImg : airCargoImg}
                alt={mode === "SEA" ? "Container ship at sea" : "Air cargo being loaded onto an aircraft"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`absolute inset-0 h-full w-full object-cover ${mode === "SEA" ? "object-right" : "object-[50%_45%]"}`}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-950/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 font-ui">
              <p className="text-2xl font-bold text-white md:text-3xl">{mode === "SEA" ? "Sea freight" : "Air freight"}</p>
            </div>
          </div>

          <div className="grid gap-10 p-6 md:p-10 lg:grid-cols-[1.35fr_1fr]">
            <ol className="sm:columns-2 sm:gap-x-10">
              {flow.map((code, i) => (
                <li key={code} className="flex break-inside-avoid items-center gap-3 border-b border-neutral-100 py-3 font-ui">
                  <span className="w-6 shrink-0 font-code text-[11px] text-neutral-400">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[15px] font-medium text-neutral-900">{logisticsStatusLabel(code)}</span>
                  {isCustomsStage(code) && (
                    <span className="ml-auto shrink-0 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-700">Customs</span>
                  )}
                </li>
              ))}
            </ol>

            <div className="space-y-6 lg:border-l lg:border-neutral-200 lg:pl-10">
              {callouts.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-red-50 text-red-600">
                    <Icon size={20} />
                  </span>
                  <div className="font-ui">
                    <h3 className="text-[15px] font-bold text-neutral-950">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── In-app preview ─────────────────────────────────────────────────────
// A faithful, non-interactive copy of the real app: same sidebar, top bar, Jobs
// list and "New Job" dialog (same copy, same three steps), built with the app's
// own Button / Input / Label / StatusBadge components and theme tokens so it
// looks exactly like the product. Plays the create-a-job flow on a loop.

const DEMO_STEP_SUBTITLES = ["Who is this Job for?", "Where's it going and what's inside?", "Reference and how it's billed"];
const DEMO_STEP_LABELS = ["Customer", "Shipment", "Billing"];
const demoField = "h-11 rounded-xl border-transparent bg-muted/50 shadow-none";

const DEMO_NAV = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Customers", icon: Users },
  { label: "Jobs", icon: Package },
  { label: "Finance", icon: Wallet },
];

const DEMO_CUSTOMER_OPTIONS = [
  "Cape Cargo Imports - accounts@capecargo.co.za",
  "Ubuntu Retail - thabo@ubuntu-retail.co.za",
  "Africa Trade Hub - naledi@africatrade.co.za",
];

const DEMO_JOBS = [
  { job: "FSL-0022-2026", customer: "Ubuntu Retail", route: "Shenzhen → Durban", mode: "SEA", status: "MID_OCEAN_TRANSIT", billing: "Paid" },
  { job: "FSL-0021-2026", customer: "Africa Trade Hub", route: "Guangzhou → Johannesburg", mode: "AIR", status: "PREPARING_FOR_SHIPMENT", billing: "Awaiting payment" },
  { job: "FSL-0020-2026", customer: "Highveld Machinery", route: "Hamburg → Cape Town", mode: "SEA", status: "VAT_DUTY_PAID", billing: "Paid" },
];
const DEMO_NEW_JOB = { job: "FSL-0023-2026", customer: "Cape Cargo Imports", route: "Shenzhen → Durban", mode: "SEA", status: "ORDER_CONFIRMED", billing: "Awaiting payment" };

const DemoInput: FC<{ value?: string; placeholder?: string; mono?: boolean }> = ({ value = "", placeholder, mono }) => (
  <Input readOnly tabIndex={-1} value={value} placeholder={placeholder} className={`${demoField} ${mono ? "font-mono" : ""}`} />
);

const DemoLabel: FC<{ children: React.ReactNode }> = ({ children }) => (
  <Label className="text-[13px] font-medium text-muted-foreground">{children}</Label>
);

const BillingChip: FC<{ value: string }> = ({ value }) => (
  <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${value === "Paid" ? "border-green-200 bg-green-100 text-green-800" : "border-amber-200 bg-amber-100 text-amber-800"}`}>
    {value}
  </span>
);

const DemoDialog: FC<{ phase: number }> = ({ phase }) => {
  const step = phase < 3 ? 1 : phase < 5 ? 2 : 3;
  const pickerOpen = phase === 1;
  const customerChosen = phase >= 2;
  const shipmentFilled = phase >= 4;
  const amountsFilled = phase >= 6;
  const creating = phase === 7;

  return (
    <div className="w-full max-w-[560px] rounded-3xl border bg-background shadow-2xl">
      <div className="px-7 pb-0 pt-7 text-left">
        <h3 className="text-[22px] font-semibold tracking-tight">New Job</h3>
        <p className="pt-1 text-[15px] text-muted-foreground">{DEMO_STEP_SUBTITLES[step - 1]}</p>
        <div className="flex items-center gap-1.5 pt-5">
          {DEMO_STEP_LABELS.map((lbl, i) => (
            <div key={lbl} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${i + 1 <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
        <p className="pt-2 text-xs font-medium text-muted-foreground">Step {step} of 3 · {DEMO_STEP_LABELS[step - 1]}</p>
      </div>

      <div className="px-7 py-6">
        {step === 1 && (
          <div className="relative space-y-2.5">
            <DemoLabel>Customer</DemoLabel>
            <Button type="button" variant="outline" tabIndex={-1} className={`w-full justify-between px-3.5 font-normal ${demoField}`}>
              <span className={`truncate ${customerChosen ? "" : "text-muted-foreground"}`}>
                {customerChosen ? DEMO_CUSTOMER_OPTIONS[0] : "Select a customer"}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40" />
            </Button>
            {pickerOpen && (
              <div className="absolute inset-x-0 top-[74px] z-10 overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-md">
                <div className="flex items-center gap-2 border-b px-3 py-2.5 text-sm text-muted-foreground">
                  <Search className="h-4 w-4 opacity-50" /> Search by name, email or company…
                </div>
                <div className="p-1">
                  {DEMO_CUSTOMER_OPTIONS.map((label, i) => (
                    <div key={label} className={`flex items-center rounded-md px-2 py-2 text-sm ${i === 0 ? "bg-accent text-accent-foreground" : ""}`}>
                      <Check className="mr-2 h-4 w-4 opacity-0" />
                      <span className="truncate">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="text-[13px] text-muted-foreground">They'll receive the invoice and shipment updates.</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2.5">
              <DemoLabel>Transport mode</DemoLabel>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: "AIR", label: "Air Freight", Icon: Plane },
                  { id: "SEA", label: "Sea Freight", Icon: Ship },
                ].map(({ id, label, Icon }) => {
                  const on = shipmentFilled && id === "SEA";
                  return (
                    <div key={id} className={`flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-all ${on ? "border-primary bg-primary/[0.06] text-foreground shadow-sm" : "border-border/70 bg-muted/30 text-muted-foreground"}`}>
                      <Icon className="h-4 w-4" />{label}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Origin", "China", "China"],
                ["Destination", "South Africa", "South Africa"],
                ["Cargo / invoice item", "Consumer electronics", "e.g. Handbags"],
                ["Service required", "Port-to-door", "e.g. Customs & tax"],
              ].map(([label, value, ph]) => (
                <div key={label} className="space-y-2">
                  <DemoLabel>{label}</DemoLabel>
                  <DemoInput value={shipmentFilled ? value : ""} placeholder={ph} />
                </div>
              ))}
            </div>
            <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Label className="text-[13px] font-medium">Boxes</Label>
                  <p className="mt-1 text-xs text-muted-foreground">Add each piece. Dimensions are optional and use centimetres.</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold">1 box</p>
                  <p className="text-xs text-muted-foreground">{shipmentFilled ? "120 kg total" : "Add weights"}</p>
                </div>
              </div>
              <div className="rounded-xl border bg-background p-3">
                <span className="mb-2.5 block text-xs font-semibold">Box 1</span>
                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    ["Weight", "120", "kg"],
                    ["Length", "80", "cm"],
                    ["Width", "60", "cm"],
                    ["Height", "60", "cm"],
                  ].map(([label, value, unit]) => (
                    <div key={label} className="min-w-0 space-y-1">
                      <Label className="text-[10px] text-muted-foreground">{label}</Label>
                      <div className="relative min-w-0">
                        <Input readOnly tabIndex={-1} value={shipmentFilled ? value : ""} placeholder="0" className="h-10 min-w-0 rounded-lg pr-8" />
                        <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-[10px] font-medium text-muted-foreground">{unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <DemoLabel>Job Number</DemoLabel>
                <DemoInput value="FSL-0023-2026" mono />
              </div>
              <div className="space-y-2">
                <DemoLabel>Est. delivery (optional)</DemoLabel>
                <DemoInput placeholder="dd/mm/yyyy" />
              </div>
            </div>
            <div className="space-y-2.5">
              <DemoLabel>Billing</DemoLabel>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {[
                  ["PREPAID", "Invoice before delivery", "Invoice and payment before the shipment moves."],
                  ["POSTPAID", "Invoice after delivery", "Ship first, invoice once it's delivered."],
                ].map(([value, title, desc]) => {
                  const on = value === "PREPAID";
                  return (
                    <div key={value} className={`relative rounded-2xl border p-4 text-left ${on ? "border-primary bg-primary/[0.05] shadow-sm" : "border-border/70 bg-muted/30"}`}>
                      <span className={`absolute right-3 top-3 grid h-4 w-4 place-items-center rounded-full border ${on ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{on && <Check className="h-3 w-3" />}</span>
                      <div className="pr-5 text-sm font-semibold">{title}</div>
                      <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-3 rounded-2xl bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <Label className="text-[13px] font-medium">Invoice amount (ZAR)</Label>
                <span className="text-lg font-semibold">ZAR {amountsFilled ? "48600.00" : "0.00"}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input readOnly tabIndex={-1} value={amountsFilled ? "48600" : ""} placeholder="Subtotal" className="h-11 rounded-xl bg-background" />
                <Input readOnly tabIndex={-1} value="" placeholder="Additional charges" className="h-11 rounded-xl bg-background" />
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">Sent as <strong className="font-medium text-foreground">Pending payment</strong>. The shipment stays locked until you confirm payment.</p>
            </div>
            <div className="space-y-2 rounded-2xl border border-dashed border-border bg-muted/20 p-4">
              <Label className="text-[13px] font-medium">Your cost for this Job <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <Input readOnly tabIndex={-1} value={amountsFilled ? "39120" : ""} placeholder="Internal cost in ZAR" className="h-11 rounded-xl bg-background" />
              <p className="text-xs leading-relaxed text-muted-foreground">Internal only. This is never shown to the customer and is used to calculate profit for this Job.</p>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center gap-2.5">
          {step > 1 && (
            <Button type="button" variant="ghost" tabIndex={-1} className="h-12 rounded-xl px-5 text-muted-foreground">Back</Button>
          )}
          <Button type="button" tabIndex={-1} disabled={step === 1 && !customerChosen} className="h-12 flex-1 rounded-xl text-[15px] font-medium">
            {step < 3 ? "Continue" : creating ? "Creating…" : "Create Job & send invoice"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const DemoJobRow: FC<{ job: typeof DEMO_NEW_JOB }> = ({ job }) => (
  <div className="grid grid-cols-[1.4fr_1fr] items-center gap-3 border-t border-border/60 px-5 py-3.5 text-sm md:grid-cols-[1.1fr_1.3fr_1.8fr_1.5fr_1.2fr]">
    <div className="min-w-0">
      <p className="truncate font-mono text-[13px] font-semibold">{job.job}</p>
      <p className="truncate text-xs text-muted-foreground md:hidden">{job.customer}</p>
    </div>
    <p className="hidden truncate md:block">{job.customer}</p>
    <p className="hidden items-center gap-1.5 truncate text-muted-foreground md:flex">
      {job.mode === "AIR" ? <Plane className="h-3.5 w-3.5 shrink-0" /> : <Ship className="h-3.5 w-3.5 shrink-0" />}
      <span className="truncate">{job.route}</span>
    </p>
    <div className="min-w-0 whitespace-nowrap"><StatusBadge status={job.status} /></div>
    <div className="hidden md:block"><BillingChip value={job.billing} /></div>
  </div>
);

const AppDemo: FC = () => {
  const [phase, setPhase] = useState(0);
  const [reduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (reduced) {
      setPhase(8);
      return;
    }
    // phases: 0 empty, 1 picker open, 2 customer chosen, 3 shipment step,
    // 4 shipment filled, 5 billing step, 6 amounts filled, 7 creating, 8 done.
    const durations = [1200, 1500, 1000, 900, 2400, 1000, 2400, 900, 4800];
    const id = window.setTimeout(() => setPhase((p) => (p + 1) % durations.length), durations[phase]);
    return () => window.clearTimeout(id);
  }, [phase, reduced]);

  const dialogOpen = phase < 8;

  return (
    <div role="img" aria-label="The Freightics Jobs screen with the New Job form being filled in" className="pointer-events-none mx-auto w-full max-w-6xl select-none overflow-hidden rounded-2xl border border-neutral-200 bg-background shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)]">
      <div className="relative flex h-[800px] lg:h-[780px]">
        <aside className="hidden w-[220px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
          <div className="flex h-14 min-w-0 flex-shrink-0 items-center gap-2.5 border-b border-sidebar-border px-5">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary shadow-sm">
              <span className="text-xs font-bold leading-none text-white">T</span>
            </div>
            <span className="min-w-0 truncate text-sm font-semibold tracking-tight">Table Bay Freight</span>
          </div>
          <nav className="flex-1 space-y-0.5 px-3 py-4">
            {DEMO_NAV.map(({ label, icon: Icon }) => {
              const active = label === "Jobs";
              return (
                <div key={label} className={`relative flex items-center gap-2.5 rounded-lg py-2 pl-3.5 pr-3 text-sm ${active ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground" : "font-medium text-sidebar-foreground/70"}`}>
                  <span aria-hidden className={`absolute left-0 top-1/2 w-1 -translate-y-1/2 rounded-full ${active ? "h-5 bg-sidebar-foreground/45" : "h-0"}`} />
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {label}
                </div>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center justify-end gap-3 border-b bg-background px-5">
            <div className="flex items-center gap-0.5 rounded-full bg-muted p-1">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-background shadow-sm"><Sun className="h-3.5 w-3.5 text-amber-500" /></span>
              <span className="grid h-6 w-6 place-items-center rounded-full"><Moon className="h-3.5 w-3.5 text-muted-foreground" /></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground"><User className="h-3.5 w-3.5" /></span>
              <span className="hidden text-sm font-medium sm:inline">Thandi Mokoena</span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
            </div>
          </header>

          <main className="flex-1 space-y-5 overflow-hidden p-5 md:p-7">
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-3xl font-bold tracking-tight">Jobs</h4>
              <Button tabIndex={-1} className="gap-2 rounded-xl"><Plus className="h-4 w-4" /> New Job</Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input readOnly tabIndex={-1} placeholder="Job number, tracking ID or customer" className="h-11 rounded-xl pl-9" />
            </div>
            <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <div className="grid grid-cols-[1.4fr_1fr] gap-3 px-5 py-3 text-xs font-medium text-muted-foreground md:grid-cols-[1.1fr_1.3fr_1.8fr_1.5fr_1.2fr]">
                <span>Job</span>
                <span className="hidden md:block">Customer</span>
                <span className="hidden md:block">Route</span>
                <span>Status</span>
                <span className="hidden md:block">Billing</span>
              </div>
              <AnimatePresence initial={false}>
                {phase >= 8 && (
                  <motion.div key="new-job" initial={{ opacity: 0, backgroundColor: "hsl(var(--primary) / 0.1)" }} animate={{ opacity: 1, backgroundColor: "hsl(var(--primary) / 0)" }} transition={{ duration: 1.2 }}>
                    <DemoJobRow job={DEMO_NEW_JOB} />
                  </motion.div>
                )}
              </AnimatePresence>
              {DEMO_JOBS.map((job) => (
                <DemoJobRow key={job.job} job={job} />
              ))}
            </div>
          </main>
        </div>

        {dialogOpen && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-black/55 p-3">
            <div className="flex max-h-full w-full justify-center [zoom:0.68] sm:[zoom:0.84]">
              <DemoDialog phase={phase} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const JobDemoSection: FC = () => (
  <section className="bg-neutral-50 py-20 md:py-28">
    <div className="mx-auto max-w-7xl px-6">
      <h2 className="mx-auto mb-12 max-w-2xl text-center font-editorial text-4xl leading-[1.05] text-neutral-950 text-balance md:mb-14 md:text-5xl">
        Create a job in three steps.
      </h2>
      <AppDemo />
    </div>
  </section>
);

// ─── Customers ──────────────────────────────────────────────────────────
const DEMO_DIRECTORY = [
  { name: "Thabo Nkosi", initials: "TN", email: "thabo@ubuntu-retail.co.za", phone: "+27 82 555 0101", company: "Ubuntu Retail" },
  { name: "Naledi Mokoena", initials: "NM", email: "naledi@africatrade.co.za", phone: "+27 72 555 0102", company: "Africa Trade Hub" },
  { name: "Amina Patel", initials: "AP", email: "amina@capecargo.co.za", phone: "+27 71 555 0104", company: "Cape Cargo Imports" },
  { name: "Lerato Molefe", initials: "LM", email: "lerato@highveld-machinery.co.za", phone: "+27 76 555 0105", company: "Highveld Machinery" },
];

const DirectoryMock: FC = () => (
  <div className="overflow-hidden rounded-tl-2xl border border-b-0 border-r-0 border-neutral-200 bg-background shadow-[0_24px_50px_-24px_rgba(0,0,0,0.35)]">
    <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
      <div>
        <p className="text-base font-semibold tracking-tight">All customers</p>
        <p className="text-xs text-muted-foreground">4 customers</p>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
        <Plus className="h-3.5 w-3.5" /> New Customer
      </span>
    </div>
    <ul>
      {DEMO_DIRECTORY.map((c) => (
        <li key={c.email} className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-border/60 px-4 py-3.5 last:border-b-0 sm:grid-cols-[1.3fr_0.95fr_1.3fr]">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{c.initials}</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{c.name}</p>
              <p className="truncate text-xs text-muted-foreground">{c.email}</p>
            </div>
          </div>
          <p className="hidden items-center gap-1.5 truncate text-sm text-muted-foreground sm:flex"><Phone className="h-3.5 w-3.5 shrink-0" />{c.phone}</p>
          <p className="flex items-center justify-end gap-1.5 truncate text-sm text-muted-foreground sm:justify-start"><Building2 className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{c.company}</span></p>
        </li>
      ))}
    </ul>
  </div>
);

const PhoneTracking: FC = () => {
  const flow = [...(logisticsFlow("SEA") ?? [])];
  const currentCode = "MID_OCEAN_TRANSIT";
  const current = flow.indexOf(currentCode);
  const start = Math.max(0, current - 2);
  const visible = flow.slice(start, current + 4);

  return (
    <div className="overflow-hidden rounded-t-[2rem] border-[6px] border-b-0 border-neutral-900 bg-white text-neutral-950 shadow-2xl">
      <div className="flex items-center gap-2.5 border-b border-neutral-100 px-5 py-4 font-ui">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-neutral-900 text-[10px] font-bold text-white">TB</span>
        <span className="text-[13px] font-semibold">Table Bay Freight</span>
      </div>
      <div className="px-5 py-5 font-ui">
        <p className="font-code text-sm font-medium">TBF-K7M-9X2A</p>
        <p className="mt-0.5 text-xs text-neutral-500">Shenzhen to Durban · ETA 12 Dec</p>
        <div className="mt-4 rounded-lg bg-neutral-50 px-3.5 py-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400">Current status</p>
          <p className="mt-0.5 text-[15px] font-bold">{logisticsStatusLabel(currentCode)}</p>
        </div>
        <ol className="mt-4">
          {visible.map((code, i) => {
            const idx = start + i;
            const state = idx < current ? "done" : idx === current ? "current" : "next";
            return (
              <li key={code} className="relative flex items-center gap-3 py-[7px]">
                {i < visible.length - 1 && <span aria-hidden className="absolute left-[8px] top-[26px] h-[calc(100%-12px)] w-px bg-neutral-200" />}
                <span className={`relative z-10 grid h-[17px] w-[17px] shrink-0 place-items-center rounded-full ${state === "done" ? "bg-neutral-900 text-white" : state === "current" ? "border-2 border-red-600 bg-white" : "border border-neutral-300 bg-white"}`}>
                  {state === "done" && <Check size={10} strokeWidth={3.5} />}
                  {state === "current" && <span className="h-1.5 w-1.5 rounded-full bg-red-600" />}
                </span>
                <span className={`text-[13px] ${state === "current" ? "font-semibold text-neutral-950" : state === "done" ? "text-neutral-700" : "text-neutral-400"}`}>{logisticsStatusLabel(code)}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

const CustomerExperienceSection: FC = () => (
  <section className="bg-white py-20 md:py-28">
    <div className="mx-auto max-w-7xl px-6">
      <h2 className="max-w-3xl font-editorial text-4xl leading-[1.05] text-neutral-950 text-balance md:text-5xl">
        Your customers always know where their cargo is.
      </h2>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="flex min-h-[500px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white font-ui">
          <div className="p-8 pb-0 md:p-10 md:pb-0">
            <h3 className="text-2xl font-bold tracking-tight text-neutral-950">Every customer, one record.</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {["Billing contacts", "Delivery contacts", "Linked to every job"].map((c) => (
                <li key={c} className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[13px] font-medium text-neutral-700">{c}</li>
              ))}
            </ul>
          </div>
          <div className="relative mt-8 flex-1">
            <div className="absolute left-6 right-0 top-0 md:left-10">
              <DirectoryMock />
            </div>
          </div>
        </div>

        <div className="flex min-h-[500px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 font-ui">
          <div className="p-8 pb-0 md:p-10 md:pb-0">
            <h3 className="text-2xl font-bold tracking-tight">Customers track it themselves.</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {["Your logo and colours", "Any phone", "WordPress plugin"].map((c) => (
                <li key={c} className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[13px] font-medium text-neutral-700">{c}</li>
              ))}
            </ul>
          </div>
          <div className="relative mt-8 flex-1">
            <div className="absolute left-1/2 top-0 w-[290px] -translate-x-1/2 md:w-[310px]">
              <PhoneTracking />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const PricingSection: FC = () => (
  <section id="pricing" className="scroll-mt-16 bg-neutral-50 py-20 md:py-28">
    <div className="mx-auto max-w-7xl px-6">
      <h2 className="mx-auto mb-14 max-w-2xl text-center font-editorial text-4xl leading-[1.05] text-neutral-950 text-balance md:text-5xl">
        Pricing built for forwarders.
      </h2>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        <div className="flex flex-col rounded-2xl border-2 border-red-600 bg-white p-8 font-ui">
          <p className="text-sm font-bold text-red-600">{plans.free.name}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-editorial text-5xl text-neutral-950">{STARTER_PRICE}</span>
            <span className="text-neutral-500">/ month</span>
          </div>
          <ul className="my-7 flex-1 space-y-3.5">
            {FREE_PLAN_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-neutral-700">
                <Check size={17} className="mt-0.5 shrink-0 text-red-600" strokeWidth={3} />
                {item}
              </li>
            ))}
          </ul>
          <Link href="/login?mode=signup" className="block rounded-md bg-red-600 py-3.5 text-center text-[15px] font-semibold text-white transition-colors hover:bg-red-700">
            Create your workspace
          </Link>
        </div>

        <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-8 font-ui">
          <p className="text-sm font-bold text-neutral-900">{plans.business.name}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-editorial text-5xl text-neutral-950">{SCALE_PRICE}</span>
            <span className="text-neutral-500">/ month</span>
          </div>
          <p className="mt-2 text-sm text-neutral-600">Everything in Starter, plus:</p>
          <ul className="my-7 flex-1 space-y-3.5">
            <li className="flex items-start gap-3 text-[15px] text-neutral-700">
              <Check size={17} className="mt-0.5 shrink-0 text-neutral-900" strokeWidth={3} />
              Higher status-update and automation limits
            </li>
            {SCALE_PREVIEW.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-neutral-700">
                <Check size={17} className="mt-0.5 shrink-0 text-neutral-400" strokeWidth={3} />
                <span>
                  {item}
                  <span className="ml-2 rounded bg-neutral-200 px-1.5 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wide text-neutral-600">Soon</span>
                </span>
              </li>
            ))}
          </ul>
          <Link href="/upgrade" className="block rounded-md border border-neutral-300 bg-white py-3.5 text-center text-[15px] font-semibold text-neutral-900 transition-colors hover:border-neutral-400">
            Compare plans
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const CTASection: FC = () => (
  <section className="bg-white px-6 pb-20 pt-4 md:pb-28">
    <div className="mx-auto grid max-w-7xl overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-8 py-14 md:px-14 md:py-20">
        <h2 className="font-editorial text-4xl leading-[1.05] text-neutral-950 text-balance md:text-5xl">
          Ready to run your freight jobs from one place?
        </h2>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row font-ui">
          <Link href="/login?mode=signup" className="group inline-flex items-center justify-center gap-2.5 rounded-md bg-red-600 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-700">
            Create your workspace
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link href="/contact" className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-6 py-3.5 text-[15px] font-semibold text-neutral-900 transition-colors hover:border-neutral-400">
            Talk to us
          </Link>
        </div>
      </div>
      <div className="relative min-h-[260px] lg:min-h-0">
        <img src={warehouseOperator} alt="Freight operator on the phone in a warehouse" className="absolute inset-0 h-full w-full object-cover object-[35%_50%]" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-100 via-neutral-100/20 to-transparent lg:via-transparent" />
      </div>
    </div>
  </section>
);

const Landing: FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goTo: GoTo = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    window.history.replaceState(null, "", `#${id}`);
    const top = el.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-neutral-900 selection:bg-red-600/20 selection:text-neutral-950">
      <style>{`
        .font-editorial { font-family: 'Manrope', 'Inter', system-ui, sans-serif; font-weight: 800; letter-spacing: -0.04em; }
        .font-ui { font-family: 'Manrope', 'Inter', system-ui, -apple-system, sans-serif; }
        .font-code { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace; }
      `}</style>

      <Nav open={mobileMenuOpen} setOpen={setMobileMenuOpen} goTo={goTo} />

      <main>
        <HeroSection goTo={goTo} />
        <BuiltForStrip />
        <ProblemSection />
        <WorkflowSection />
        <JobDemoSection />
        <CustomerExperienceSection />
        <PricingSection />
        <CTASection />
      </main>

      <SiteFooter />
    </div>
  );
};

// ─── SiteFooter ──────────────────────────────────────────────────────────
// Exported for other pages (e.g. the contact page) so it stays self-contained:
// no landing-scoped font utilities, only theme-neutral Tailwind classes.
const FOOTER_COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Pricing", href: "/upgrade" },
      { label: "Create workspace", href: "/login?mode=signup" },
      { label: "Log in", href: "/login" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Olyxee", href: "https://olyxee.com", external: true },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "https://olyxee.com/terms", external: true },
      { label: "Privacy Policy", href: "https://olyxee.com/privacy", external: true },
    ],
  },
];

export const SiteFooter: FC = () => (
  <footer className="border-t border-neutral-200 bg-neutral-50 text-neutral-600">
    <div className="mx-auto max-w-7xl px-6 pb-8 pt-16">
      <div className="grid gap-12 md:grid-cols-[1.4fr_2fr] lg:gap-20">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <img src={freighticsLogo} alt="" className="h-9 w-9 object-contain" />
            <span className="text-lg font-bold tracking-tight text-neutral-950">Freightics</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">Freight forwarding software for South African forwarders.</p>
          <ul className="mt-6 space-y-3 text-sm">
            <li>
              <a href="mailto:scofield@olyxee.com" className="inline-flex items-center gap-2.5 transition-colors hover:text-neutral-950">
                <Mail className="h-4 w-4 text-neutral-400" /> scofield@olyxee.com
              </a>
            </li>
            <li>
              <a href="tel:+27712233272" className="inline-flex items-center gap-2.5 transition-colors hover:text-neutral-950">
                <Phone className="h-4 w-4 text-neutral-400" /> +27 71 223 3272
              </a>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-neutral-950">{col.title}</p>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition-colors hover:text-neutral-950">
                        {l.label} <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                      </a>
                    ) : (
                      <Link href={l.href} className="transition-colors hover:text-neutral-950">{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-3 border-t border-neutral-200 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Freightics. All rights reserved.</p>
        <p className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <a href="https://olyxee.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-neutral-950">A product of Olyxee</a>
          <span>Made in South Africa</span>
        </p>
      </div>
    </div>
  </footer>
);

export default Landing;
