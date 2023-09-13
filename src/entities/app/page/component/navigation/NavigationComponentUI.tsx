import React from 'react'
import { BaseUIProps } from '../base/BaseUI'
import { IUISpi } from '../../../../drivers/ui/IUISpi'

export interface NavigationProps {
  ui: IUISpi
  Title: React.FC
  Links: React.FC[]
  Components: React.FC[]
}

export function NavigationComponentUI({ ui, Title, Links, Components }: NavigationProps) {
  const { Container, Sidebar, LinksContainer, Content } = ui.NavigationUI
  return (
    <Container>
      <Sidebar>
        <Title />
        <LinksContainer>
          {Links.map((Link, index) => (
            <Link key={index} />
          ))}
        </LinksContainer>
      </Sidebar>
      <Content>
        {Components.map((Component, index) => (
          <Component key={index} />
        ))}
      </Content>
    </Container>
  )
}

export interface NavigationUI {
  Container: React.FC<BaseUIProps>
  Sidebar: React.FC<BaseUIProps>
  LinksContainer: React.FC<BaseUIProps>
  Content: React.FC<BaseUIProps>
}
