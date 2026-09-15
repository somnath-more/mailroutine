import type { ButtonHTMLAttributes } from 'react'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

export function IconButton({
  label,
  className = '',
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`icon-button ${className}`.trim()}
      type={type}
      aria-label={label}
      title={label}
      {...props}
    />
  )
}
