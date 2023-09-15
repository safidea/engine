import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { IUISpi } from '../../../../services/ui/IUISpi'

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
  Container: React.FC<BaseComponentUIProps>
  Sidebar: React.FC<BaseComponentUIProps>
  LinksContainer: React.FC<BaseComponentUIProps>
  Content: React.FC<BaseComponentUIProps>
}
