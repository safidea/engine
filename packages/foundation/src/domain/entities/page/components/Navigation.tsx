import React from 'react'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { BaseComponent } from './BaseComponent'
import { Link } from './Link'
import { Title } from './Title'
import { Component } from '../Component'

export interface NavigationProps {
  TitleComponent: React.FC
  LinksComponent: React.FC[]
  Components: React.FC[]
}

export class Navigation extends BaseComponent {
  constructor(
    private readonly _title: Title,
    private readonly _links: Link[],
    private readonly _components: Component[],
    private readonly _ui: IUIGateway['NavigationUI']
  ) {
    super('navigation')
  }

  get title(): Title {
    return this._title
  }

  get links(): Link[] {
    return this._links
  }

  get components(): Component[] {
    return this._components
  }

  renderUI() {
    const UI = this._ui
    return function Component({ TitleComponent, LinksComponent, Components }: NavigationProps) {
      return (
        <UI.container>
          <UI.sidebar>
            <TitleComponent />
            <UI.links>
              {LinksComponent.map((LinkComponent, index) => (
                <UI.link key={index}>
                  <LinkComponent />
                </UI.link>
              ))}
            </UI.links>
          </UI.sidebar>
          <UI.content>
            {Components.map((Component, index) => (
              <Component key={index} />
            ))}
          </UI.content>
        </UI.container>
      )
    }
  }
}
