import type React from 'react'

type ButtonTone = 'primary' | 'secondary'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: ButtonTone
}

export function Button({ children, className = '', tone = 'primary', ...props }: ButtonProps) {
  return (
    <button className={`button button-${tone} ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}

export function buttonClassName(tone: ButtonTone = 'primary'): string {
  return `button button-${tone}`
}
