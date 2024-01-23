import type { Component } from '@domain/entities/component/Component'
import type { IPageComponent } from '@domain/entities/page/IPageComponent'

export interface IUiPage {
  addComponent: (component: Component, props: Omit<IPageComponent, 'component'>) => Promise<void>
  render: () => string
}

export interface IUi {
  createPage: () => IUiPage
}
