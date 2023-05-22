import cp from 'child_process'
import debug from 'debug'

const log: debug.IDebugger = debug('utils:process')

class ProcessUtils {
  runCommand(command: string): string {
    const output = cp.execSync(command, { encoding: 'utf-8' })
    log(`Run command "${command}"`)
    log(output)
    return output
  }
}

export default new ProcessUtils()
