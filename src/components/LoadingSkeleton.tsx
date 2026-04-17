export const LoadingSkeleton = () => (
  <main className="tem-app mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-4 p-4 lg:gap-5 lg:p-6">
    <div className="h-20 animate-pulse rounded-2xl bg-gradient-to-r from-indigo-100 via-violet-100 to-fuchsia-100" />
    <div className="h-40 animate-pulse rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-100" />
    <div className="h-28 animate-pulse rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-100" />
    <section className="grid flex-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
      <div className="h-[420px] animate-pulse rounded-2xl bg-gradient-to-br from-indigo-100 to-slate-100 lg:h-full" />
      <div className="h-[420px] animate-pulse rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-50 lg:h-full" />
    </section>
  </main>
)
