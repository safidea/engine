import { ContextParams } from './ContextParams'

export class Context {
  constructor(readonly context: ContextParams) {}

  getValue(path: string) {
    const parts = path.replace(/{{|}}/g, '').split('.')
    switch (parts[0]) {
      case 'path':
        switch (parts[1]) {
          case 'params':
            return this.context.path.params[parts[2]]
        }
      default:
        throw new Error(`Invalid path: ${path}`)
    }
  }
}
