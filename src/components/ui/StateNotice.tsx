import type { ReactNode } from 'react'

interface StateNoticeProps {
  title: string
  message: ReactNode
  tone?: 'default' | 'error'
  action?: ReactNode
  className?: string
}

export const StateNotice = ({ title, message, tone = 'default', action, className = '' }: StateNoticeProps) => {
  const toneClass =
    tone === 'error'
      ? 'border-rose-200/90 bg-rose-50/80 text-rose-950'
      : 'border-warm-border bg-white text-ink-muted'

  return (
    <div className={`state-card border ${toneClass} ${className}`.trim()}>
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">{title}</p>
      <div className="mt-2 text-sm">{message}</div>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
