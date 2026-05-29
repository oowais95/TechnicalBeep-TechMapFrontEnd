interface LoadingSkeletonProps {
  hasFeatured?: boolean
}

export const LoadingSkeleton = ({ hasFeatured = false }: LoadingSkeletonProps) => (
  <main className="tem-app">
    <div
      className="fixed inset-x-0 top-0 z-30 animate-pulse border-b border-warm-border bg-white/90"
      style={{ height: 'var(--app-header-height)' }}
    />

    <div
      className="absolute animate-pulse bg-[#e8e4dc]"
      style={{
        top: 'var(--app-header-height)',
        left: 0,
        right: 0,
        bottom: hasFeatured ? 'var(--featured-bar-height)' : 0,
      }}
    />

    <div
      className="fixed left-0 z-20 w-full max-w-[380px] animate-pulse border-r border-warm-border bg-white/90"
      style={{
        top: 'var(--app-header-height)',
        bottom: hasFeatured ? 'var(--featured-bar-height)' : 0,
      }}
    />

    {hasFeatured ? (
      <div
        className="fixed inset-x-0 bottom-0 z-30 animate-pulse border-t border-warm-border bg-cream-dark/80"
        style={{ height: 'var(--featured-bar-height)' }}
      />
    ) : null}
  </main>
)
