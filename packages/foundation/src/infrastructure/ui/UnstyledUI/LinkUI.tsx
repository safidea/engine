import { LinkUIProps } from '@domain/repositories/IUIRepository'

export default function LinkUI({ children, href }: LinkUIProps) {
  return <a href={href}>{children}</a>
}
