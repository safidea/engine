export interface ContextValues {
  path: {
    params: { [key: string]: string }
  }
}

export class Context {
  private _values: ContextValues

  constructor(readonly params: { [key: string]: string }) {
    this._values = {
      path: {
        params,
      },
    }
  }

  getValue(path: string) {
    const parts = path.replace(/{{|}}/g, '').split('.')
    switch (parts[0]) {
      case 'path':
        switch (parts[1]) {
          case 'params':
            return this._values.path.params[parts[2]]
        }
      default:
        throw new Error(`Invalid path: ${path}`)
    }
  }
}
