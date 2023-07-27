import { UIProps } from '@domain/repositories/IUIRepository'

export default function ParagraphUI({ children }: UIProps) {
  return <p>{children}</p>
}
