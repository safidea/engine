import { Tables } from '../Tables'
import { Component } from './component/Component'

export interface PageContext {
  path: {
    params: { [key: string]: string }
  }
}

export interface PageConfig {
  tables: Tables
}

export class Page {
  constructor(
    private readonly _path: string,
    private readonly _components: Component[],
    private readonly _title?: string
  ) {}

  get path(): string {
    return this._path
  }

  get title(): string | undefined {
    return this._title
  }

  get components(): Component[] {
    return this._components
  }
}
