import { UIProps } from '@domain/gateways/IUIGateway'

export default function ParagraphUI({ children }: UIProps) {
  return <p>{children}</p>
}
