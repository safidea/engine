import { UIProps } from '@domain/repositories/IUIRepository'

export default function ParagraphUI({ children, ...props }: UIProps) {
  return <p {...props}>{children}</p>
}
