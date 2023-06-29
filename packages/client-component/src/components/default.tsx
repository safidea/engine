/* eslint-disable @typescript-eslint/no-unused-vars */
import { HTML_TAGS } from '../constants/html.constant'

import type { CommonPropsType } from '../types/common.type'

export default function Html({
  tag,
  children,
  appProviderComponents,
  router,
  ...props
}: CommonPropsType): JSX.Element {
  if (tag && !HTML_TAGS.includes(tag)) {
    throw new Error(`Invalid tag: ${tag}`)
  }
  const Tag = tag as keyof JSX.IntrinsicElements
  if (!children) return <Tag {...props} />
  return <Tag {...props}>{children}</Tag>
}
