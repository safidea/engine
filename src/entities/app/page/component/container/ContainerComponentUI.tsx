import { IUISpi } from '@entities/app/page/IUISpi'
import { BaseUIProps } from '../../base/BaseUI'

export interface ContainerProps {
  ui: IUISpi
  children: JSX.Element[]
}

export function ContainerComponentUI({ ui, children }: ContainerProps) {
  const { Container } = ui.ContainerUI
  return <Container>{children}</Container>
}

export interface ContainerUI {
  Container: React.FC<BaseUIProps>
}
