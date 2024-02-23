import { BaseRecordFieldValue } from '../database/record/state/base/BaseRecordData'

export interface ScripterContext {
  [key: string]: BaseRecordFieldValue | BaseRecordFieldValue[]
}

export class Scripter {
  constructor(
    readonly script: string,
    readonly context: ScripterContext = {}
  ) {}

  run(): string | number | boolean | undefined {
    let code = ''
    if (this.context) {
      for (const key in this.context) {
        let line = ''
        switch (typeof this.context[key]) {
          case 'string':
            line = `let ${key} = "${this.context[key]}";`
            break
          case 'number':
          case 'boolean':
            line = `let ${key} = ${this.context[key]};`
            break
          case 'undefined':
            line = `let ${key} = undefined;`
            break
          case 'object':
            line = `let ${key} = ${JSON.stringify(this.context[key])};`
            break
          default:
            throw new Error(`Type ${typeof this.context[key]} not supported`)
        }
        code += line + '\n'
      }
    }
    for (const key in functions) {
      code += `const ${key} = ${functions[key]}` + '\n'
    }
    code += this.script
    return eval(code)
  }
}

const functions: { [key: string]: string } = {
  sum: String((array: (number | string)[]) => array.reduce((a, b) => Number(a) + Number(b), 0)),
}
