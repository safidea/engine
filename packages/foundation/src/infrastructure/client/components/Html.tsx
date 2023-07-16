export interface HtmlProps {
  Tag: keyof JSX.IntrinsicElements
  children?: React.ReactNode
}

export default function Html({ Tag, children, ...props }: HtmlProps) {
  if (!children) return <Tag {...props} />
  return <Tag {...props}>{children}</Tag>
}
