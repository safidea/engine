import React from 'react'
import { AppDrivers, AppConfig } from '../App'
import { TableList } from '../table/TableList'
import { PageContext } from './PageContext'
import { PageParams } from './PageParams'
import { Component, newComponent } from './component/Component'

export interface PageConfig {
  tables: TableList
}

export class Page {
  readonly path: string
  readonly title?: string
  readonly components: Component[]

  constructor(params: PageParams, drivers: AppDrivers, config: AppConfig) {
    this.path = params.path
    this.title = params.title
    this.components = params.components.map((componentParams) =>
      newComponent(componentParams, drivers, config)
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
