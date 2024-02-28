import type { ReactComponent, Base, BaseProps } from './base'

export type Type =
  | 'Cog'
  | 'ChartBarSquare'
  | 'Scale'
  | 'Cog6Tooth'
  | 'Banknotes'
  | 'ChatBubbleLeftEllipsis'
  | 'FaceSmile'
  | 'ComputerDesktop'
  | 'DevicePhoneMobile'
  | 'CommandLine'
  | 'MagnifyingGlass'
  | 'AcademicCap'
  | 'ChatBubbleBottomCenterText'
  | 'Home'
  | 'Users'
  | 'RectangleStack'

export interface Props extends BaseProps {
  type: Type
}

interface Params extends Props {
  Component: ReactComponent<Props>
}

export class Icon implements Base<Props> {
  constructor(private params: Params) {}

  init = async () => {}

  render = async () => {
    const { Component, ...defaultProps } = this.params
    return (props?: Partial<Props>) => <Component {...{ ...defaultProps, ...props }} />
  }

  validateConfig = () => {
    return []
  }
}
