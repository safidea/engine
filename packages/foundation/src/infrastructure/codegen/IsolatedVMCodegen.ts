import { ICodegenRepository } from '@domain/repositories/ICodegenRepository'
import ivm from 'isolated-vm'

export class IsolatedVMCodegen implements ICodegenRepository {
  async runScript(
    script: string,
    context: { [key: string]: string | number | boolean | undefined }
  ): Promise<string | number | boolean | undefined> {
    const isolate = new ivm.Isolate({ memoryLimit: 128 })
    const contextGlobal = isolate.createContextSync()
    const jail = contextGlobal.global
    for (const key in context) {
      jail.setSync(key, context[key])
    }
    const scriptSync = await isolate.compileScript(script)
    return scriptSync.run(contextGlobal)
  }
}
