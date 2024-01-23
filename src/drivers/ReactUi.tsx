import ReactDOMServer from 'react-dom/server'
import type { IUi, IUiPage } from '@domain/drivers/IUi'
import type { Component } from '@domain/entities/component/Component'
import type { IPageComponent } from '@domain/entities/page/IPageComponent'

export class ReactUi implements IUi {
  createPage() {
    return new ReactUiPage()
  }
}

export class ReactUiPage implements IUiPage {
  private components: { component: Component; props: Omit<IPageComponent, 'component'> }[] = []

  constructor() {}

  async addComponent(component: Component, props: Omit<IPageComponent, 'component'>) {
    this.components.push({ component, props })
  }

  render() {
    const component = (
      <div>
        {this.components.map(({ component, props }, index) => {
          const Component = component.template
          // TODO: remove this warnings
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return <Component key={index} {...props} />
        })}
      </div>
    )
    return ReactDOMServer.renderToString(component)
  }
}
