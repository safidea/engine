import { Component } from './Component'

export class Page {
  constructor(
    private readonly _path: string,
    private readonly _title?: string,
    private readonly _components: Component[] = []
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
