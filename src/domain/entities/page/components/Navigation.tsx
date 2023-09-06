import React from 'react'
import { BaseComponent } from './BaseComponent'
import { Link } from './Link'
import { Title } from './Title'
import { Component } from '../Component'
import { NavigationUI } from '../../../spi/ui/NavigationUI'

export interface NavigationProps {
  TitleComponent: React.FC
  LinksComponent: React.FC[]
  Components: React.FC[]
}

export function NavigationComponent({
  UI,
  TitleComponent,
  LinksComponent,
  Components,
}: NavigationProps & { UI: NavigationUI }) {
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

export class Navigation extends BaseComponent {
  constructor(
    private readonly _title: Title,
    private readonly _links: Link[],
    private readonly _components: Component[],
    private readonly _ui: NavigationUI
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
    return ({ TitleComponent, LinksComponent, Components }: NavigationProps) => (
      <NavigationComponent
        UI={this._ui}
        TitleComponent={TitleComponent}
        LinksComponent={LinksComponent}
        Components={Components}
      />
    )
  }
}
