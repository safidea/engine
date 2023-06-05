import { HTML_TAGS } from '../libraries/html.library'

import type { CommonPropsType } from '../types/common.type'

export default function Html({ tag, children, ...props }: CommonPropsType) {
  if (tag && !HTML_TAGS.includes(tag)) {
    console.log(`Tag "${tag}" is not a valid HTML tag, fallback to div tag`)
    tag = 'div'
  }
  const Tag = tag as keyof JSX.IntrinsicElements
  if (!children) return <Tag {...props} />
  return <Tag {...props}>{children}</Tag>
}
