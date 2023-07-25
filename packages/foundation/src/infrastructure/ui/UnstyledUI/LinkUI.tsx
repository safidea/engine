import { LinkUIProps } from '@domain/repositories/IUIRepository'

export default function LinkUI({ children, ...props }: LinkUIProps) {
  return <a {...props}>{children}</a>
}
