export const LoadingSkeleton = () => (
  <main className="tem-app mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-4 p-4 lg:gap-5 lg:p-6">
    <div className="tem-surface h-20 animate-pulse rounded-3xl bg-gradient-to-r from-white/80 via-indigo-50/70 to-fuchsia-50/70" />
    <div className="tem-surface h-40 animate-pulse rounded-3xl bg-gradient-to-r from-white/80 to-indigo-50/75" />
    <div className="tem-surface h-28 animate-pulse rounded-3xl bg-gradient-to-r from-violet-50/70 to-white/75" />
    <section className="grid flex-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
      <div className="tem-surface h-[420px] animate-pulse rounded-3xl bg-gradient-to-br from-white/75 to-indigo-50/70 lg:h-full" />
      <div className="tem-surface h-[420px] animate-pulse rounded-3xl bg-gradient-to-br from-white/75 to-violet-50/70 lg:h-full" />
    </section>
  </main>
)
