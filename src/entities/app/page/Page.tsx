import React from 'react'
import { AppDrivers, AppConfig } from '../App'
import { TableList } from '../table/TableList'
import { PageContext } from './PageContext'
import { PageOptions } from './PageOptions'
import { Component, newComponent } from './component/Component'

export interface PageConfig {
  tables: TableList
}

export class Page {
  readonly path: string
  readonly title?: string
  readonly components: Component[]

  constructor(options: PageOptions, drivers: AppDrivers, config: AppConfig) {
    this.path = options.path
    this.title = options.title
    this.components = options.components.map((componentOptions) =>
      newComponent(componentOptions, drivers, config)
    )
  }

  async render(context: PageContext) {
    const Components = await Promise.all(
      this.components.map((component) => component.render(context))
    )
    return () => {
      return (
        <>
          {Components.map((Component, index) => {
            return <Component key={index} />
          })}
        </>
      )
    }
  }
}
