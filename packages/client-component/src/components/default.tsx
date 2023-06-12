/* eslint-disable @typescript-eslint/no-unused-vars */
import { HTML_TAGS } from '../constants/html.constant'

import type { CommonPropsType } from '../types/common.type'

export default function Html({
  tag,
  children,
  config,
  customComponents,
  fetcherProvider,
  ...props
}: CommonPropsType): JSX.Element {
  if (tag && !HTML_TAGS.includes(tag)) {
    console.warn(`Tag "${tag}" is not a valid HTML tag, fallback to div tag`)
    tag = 'div'
  }
  const Tag = tag as keyof JSX.IntrinsicElements
  if (!children) return <Tag {...props} />
  return <Tag {...props}>{children}</Tag>
}
