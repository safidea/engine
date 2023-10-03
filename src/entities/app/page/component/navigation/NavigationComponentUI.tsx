import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { BaseComponentProps } from '../base/BaseComponentProps'

export interface NavigationProps extends BaseComponentProps {
  Title: React.FC
  Links: React.FC[]
  Components: React.FC[]
}

export function NavigationComponentUI({ ui, Title, Links, Components }: NavigationProps) {
  const { Container, Sidebar, LinksContainer, LinkItem, Content } = ui.getNavigation()
  return (
    <Container>
      <Sidebar>
        <Title />
        <LinksContainer>
          {Links.map((Link, index) => (
            <LinkItem key={index}>
              <Link />
            </LinkItem>
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
  LinkItem: React.FC<BaseComponentUIProps>
  Content: React.FC<BaseComponentUIProps>
}
