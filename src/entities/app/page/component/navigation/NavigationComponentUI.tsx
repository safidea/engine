import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { BaseComponentProps } from '../base/BaseComponentProps'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface NavigationProps extends BaseComponentProps {
  Title: React.FC
  Links: React.FC[]
  Components: React.FC[]
  style?: {
    container?: UIStyle
    sidebar?: UIStyle
    title?: UIStyle
    linksContainer?: UIStyle
    linkItem?: UIStyle
    content?: UIStyle
  }
}

export function NavigationComponentUI({
  ui,
  Title,
  Links,
  Components,
  style = {},
}: NavigationProps) {
  const { Container, Sidebar, LinksContainer, LinkItem, Content } = ui.getNavigation()
  return (
    <Container style={style.container}>
      <Sidebar style={style.sidebar}>
        <Title />
        <LinksContainer style={style.linksContainer}>
          {Links.map((Link, index) => (
            <LinkItem key={index} style={style.linkItem}>
              <Link />
            </LinkItem>
          ))}
        </LinksContainer>
      </Sidebar>
      <Content style={style.content}>
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
