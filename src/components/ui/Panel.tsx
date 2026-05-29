import type { ReactNode } from 'react'

interface PanelProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'aside'
}

export const Panel = ({ children, className = '', as = 'div' }: PanelProps) => {
  const Tag = as
  return <Tag className={`tem-panel ${className}`.trim()}>{children}</Tag>
}
