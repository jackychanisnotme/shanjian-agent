import type React from 'react'

interface BadgeProps {
  children: React.ReactNode
  tone?: 'neutral' | 'urgent' | 'success' | 'warning'
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}
