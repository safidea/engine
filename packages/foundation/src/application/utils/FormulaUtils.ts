import ivm from 'isolated-vm'

export async function runFormula(
  script: string,
  context?: {
    [key: string]: string | number | boolean | undefined | (number | string | boolean | undefined)[]
  },
  functions?: { [key: string]: string }
): Promise<string | number | boolean | undefined> {
  const isolate = new ivm.Isolate({ memoryLimit: 128 })
  const contextGlobal = isolate.createContextSync()
  if (context) {
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
      await contextGlobal.eval(line)
    }
  }
  if (functions) {
    for (const key in functions) {
      await contextGlobal.eval(`const ${key} = ${functions[key]}`)
    }
  }
  const scriptSync = await isolate.compileScript(script)
  return scriptSync.run(contextGlobal)
}
