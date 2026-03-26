import { Suspense } from "react";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { TicketSelector } from "@/components/TicketSelector";

interface ActivityStatus {
  availableTickets: number;
  status: string;
  eventName: string;
  eventDate: string;
  venue: string;
  pricePerTicket: number;
}

async function getActivityStatus(): Promise<ActivityStatus | null> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/activity/status`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function InfoCard({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-6 text-center backdrop-blur-sm transition-colors hover:border-white/15">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gray-500">{title}</p>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{sub}</p>
    </div>
  );
}

function TicketCounterSkeleton() {
  return (
    <div className="mb-12 rounded-3xl border border-white/8 bg-white/4 px-12 py-8">
      <p className="mb-2 text-sm text-gray-400">Tickets Remaining</p>
      <div className="h-[72px] w-40 animate-pulse rounded-lg bg-white/10 mx-auto" />
    </div>
  );
}

export default async function HomePage() {
  const activity = await getActivityStatus();
  const totalTickets = 500;
  const soldPercent = activity
    ? Math.round(((totalTickets - activity.availableTickets) / totalTickets) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Ambient gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-700/15 blur-[120px]" />
        <div className="absolute top-1/3 -left-32 h-[400px] w-[400px] rounded-full bg-fuchsia-700/10 blur-[100px]" />
        <div className="absolute top-1/2 -right-32 h-[350px] w-[350px] rounded-full bg-indigo-700/10 blur-[100px]" />
      </div>

      {/* Hero */}
      <section className="flex flex-col items-center px-4 pb-20 pt-20 text-center">
        {/* Live badge */}
        <div className="mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
          </span>
          <AnimatedShinyText
            className="text-xs font-semibold uppercase tracking-widest text-gray-300"
            shimmerWidth={120}
          >
            Limited Tickets&nbsp;·&nbsp;While Supplies Last
          </AnimatedShinyText>
        </div>

        <h1 className="mb-3 bg-gradient-to-br from-white via-white/90 to-white/50 bg-clip-text text-7xl font-black tracking-tight text-transparent md:text-9xl">
          NOVA
        </h1>
        <p className="mb-1 text-2xl font-semibold text-violet-300 md:text-3xl">
          World Tour 2026
        </p>
        <p className="mb-1 text-base text-gray-400">Taipei Arena&nbsp;·&nbsp;台北小巨蛋</p>
        <p className="mb-14 text-sm text-gray-600">
          May&nbsp;17,&nbsp;2026&nbsp;&nbsp;·&nbsp;&nbsp;Doors 18:00&nbsp;&nbsp;·&nbsp;&nbsp;Show 19:00
        </p>

        {/* Ticket counter */}
        <div className="mb-14 w-full max-w-sm rounded-3xl border border-white/10 bg-white/4 px-10 py-8 backdrop-blur-sm">
          {activity ? (
            <>
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-gray-500">
                Tickets Remaining
              </p>
              <div className="mb-4 flex items-baseline justify-center gap-1.5">
                <NumberTicker
                  value={activity.availableTickets}
                  className="tabular-nums text-6xl font-black text-white"
                />
                <span className="text-lg text-gray-500">/ {totalTickets}</span>
              </div>

              {/* Sold progress bar */}
              <div
                role="progressbar"
                aria-valuenow={soldPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${soldPercent}% of tickets sold`}
                className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-1000"
                  style={{ width: `${soldPercent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-600">{soldPercent}% sold</p>

              {activity.availableTickets < 100 && (
                <p className="mt-3 text-xs font-semibold text-amber-400">
                  ⚡ Selling fast — limited seats remain
                </p>
              )}
            </>
          ) : (
            <div className="py-2 text-center">
              <p className="text-sm text-red-400">Ticket system temporarily unavailable</p>
              <p className="mt-1 text-xs text-gray-600">Please refresh and try again</p>
            </div>
          )}
        </div>

        <Suspense fallback={<TicketCounterSkeleton />}>
          <TicketSelector />
        </Suspense>
      </section>

      {/* Event details */}
      <section className="mx-auto max-w-3xl px-4 pb-28">
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <InfoCard title="Venue" value="Taipei Arena" sub="台北小巨蛋" />
          <InfoCard title="Date" value="May 17, 2026" sub="Sunday" />
          <InfoCard title="From" value="NT$2,800" sub="per ticket" />
        </div>

        {/* Lineup */}
        <div className="rounded-2xl border border-white/8 bg-white/4 p-8 text-center backdrop-blur-sm">
          <p className="mb-5 text-xs font-medium uppercase tracking-widest text-gray-500">
            Performing
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {(["ARIA", "ZARA", "LUNA", "MIKA"] as const).map((name) => (
              <div
                key={name}
                className="rounded-xl border border-violet-500/25 bg-violet-500/10 px-6 py-2.5"
              >
                <span className="text-base font-bold tracking-wide text-violet-200">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
