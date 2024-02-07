import type { FrameProps } from '@domain/services/Ui'

export interface Driver {
  render: (component: JSX.Element) => string
  Frame: (props: FrameProps) => JSX.Element
}
