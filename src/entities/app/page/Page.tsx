import React from 'react'
import { AppDrivers } from '../App'
import { Tables } from '../Tables'
import { Context } from './Context'
import { PageOptions } from './PageOptions'
import { Component, newComponent } from './component/Component'

export interface PageConfig {
  tables: Tables
}

export class Page {
  readonly path: string
  readonly title?: string
  readonly components: Component[]

  constructor(options: PageOptions, drivers: AppDrivers, config: PageConfig) {
    this.path = options.path
    this.title = options.title
    this.components = options.components.map((componentOptions) =>
      newComponent(componentOptions, drivers, config)
    )
  }

  async render(context: Context) {
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

export class Pages {
  constructor(private readonly pages: Page[]) {}

  async render(path: string, context: Context): Promise<React.FC> {
    const page = this.getPageByPath(path)
    const PageComponent = await page.render(context)
    return PageComponent
  }

  getPageByPath(path: string): Page {
    const page = this.pages.find((page) => page.path === path)
    if (!page) {
      throw new Error(`Page not found: ${path}`)
    }
    return page
  }
}
