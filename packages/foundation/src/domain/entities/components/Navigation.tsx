import { IUIRepository } from '@domain/repositories/IUIRepository'
import { BaseComponent } from './BaseComponent'
import { Link } from './Link'
import { Title } from './Title'
import { Component } from '../Component'

export class Navigation extends BaseComponent {
  constructor(
    private readonly _title: Title,
    private readonly _links: Link[],
    private readonly _components: Component[],
    private readonly _ui: IUIRepository['NavigationUI']
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

  get render() {
    const UI = this._ui
    const title = this._title
    const links = this._links
    const components = this._components
    return function NavigationComponent() {
      return (
        <UI.container>
          <UI.sidebar>
            <title.render />
            <UI.links>
              {links.map((link, index) => (
                <link.render key={index} />
              ))}
            </UI.links>
          </UI.sidebar>
          <UI.content>
            {components.map((component, index) => (
              <component.render key={index} />
            ))}
          </UI.content>
        </UI.container>
      )
    }
  }
}
