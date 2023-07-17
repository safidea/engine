import { HtmlProps } from '@domain/components/IHtmlProps'

export default function Html({ Tag, children, ...props }: HtmlProps) {
  if (!children) return <Tag {...props} />
  return <Tag {...props}>{children}</Tag>
}
