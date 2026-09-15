import type { ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'small' | 'medium'
}

export function Button({
  variant = 'primary',
  size = 'medium',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button ${className}`.trim()}
      data-variant={variant}
      data-size={size}
      type={type}
      {...props}
    />
  )
}
