import { ReactNode } from 'react'
import { HTML_TAGS } from '../libraries/html.library'

export interface HtmlProps {
  tag: keyof JSX.IntrinsicElements
  children?: ReactNode
}

export default function Html({ tag: Tag, children, ...props }: HtmlProps) {
  if (!HTML_TAGS.includes(Tag)) {
    console.log(`Tag "${Tag}" is not a valid HTML tag, fallback to div tag`)
    Tag = 'div'
  }
  if (!children) return <Tag {...props} />
  return <Tag {...props}>{children}</Tag>
}
