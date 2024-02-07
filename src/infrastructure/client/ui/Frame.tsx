import type { FrameId, FrameProps as UiFrameProps, Navigation } from '@domain/services/Ui'

export type FrameTarget = string | '_top' | '_self'

export interface FrameBaseProps {
  'data-turbo-action'?: Navigation
}

export interface FrameProps extends FrameBaseProps {
  id: string
  src?: string
  children?: React.ReactNode
  target?: FrameTarget
}

export default function Frame({ navigation, frameId, children, ...res }: UiFrameProps) {
  const props: FrameProps = res
  if (frameId) props.target = toFrameTarget(frameId)
  if (navigation) props['data-turbo-action'] = navigation
  return <turbo-frame {...props}>{children}</turbo-frame>
}

export function toFrameTarget(frameId: FrameId): FrameTarget {
  if (frameId === 'page') return '_top'
  else if (frameId === 'self') return '_self'
  return frameId
}
