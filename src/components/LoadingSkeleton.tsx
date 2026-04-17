export const LoadingSkeleton = () => (
  <main className="tem-app mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-4 p-4 lg:gap-5 lg:p-6">
    <div className="h-16 animate-pulse rounded-xl bg-slate-200" />
    <div className="h-40 animate-pulse rounded-xl bg-slate-200" />
    <div className="h-24 animate-pulse rounded-xl bg-slate-200" />
    <section className="grid flex-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
      <div className="h-[420px] animate-pulse rounded-xl bg-slate-200 lg:h-full" />
      <div className="h-[420px] animate-pulse rounded-xl bg-slate-200 lg:h-full" />
    </section>
  </main>
)
