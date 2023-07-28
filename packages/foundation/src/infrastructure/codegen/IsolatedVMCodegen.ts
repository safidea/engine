import { ICodegenGateway } from '@domain/gateways/ICodegenGateway'
import ivm from 'isolated-vm'

export class IsolatedVMCodegen implements ICodegenGateway {
  async runScript(
    script: string,
    context: {
      [key: string]:
        | string
        | number
        | boolean
        | undefined
        | (number | string | boolean | undefined)[]
    },
    functions: { [key: string]: string }
  ): Promise<string | number | boolean | undefined> {
    const isolate = new ivm.Isolate({ memoryLimit: 128 })
    const contextGlobal = isolate.createContextSync()
    const promises = []
    for (const key in context) {
      let line = ''
      switch (typeof context[key]) {
        case 'string':
          line = `let ${key} = "${context[key]}";`
          break
        case 'number':
        case 'boolean':
          line = `let ${key} = ${context[key]};`
          break
        case 'undefined':
          line = `let ${key} = undefined;`
          break
        case 'object':
          line = `let ${key} = ${JSON.stringify(context[key])};`
          break
        default:
          throw new Error(`Type ${typeof context[key]} not supported`)
      }
      promises.push(contextGlobal.eval(line))
    }
    if (functions) {
      for (const key in functions) {
        promises.push(contextGlobal.eval(`const ${key} = ${functions[key]}`))
      }
    }
    await Promise.all(promises)
    const scriptSync = await isolate.compileScript(script)
    return scriptSync.run(contextGlobal)
  }
}
