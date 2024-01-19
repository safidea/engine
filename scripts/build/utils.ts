import debug from 'debug'
import { execSync } from 'child_process'

export const log = debug('engine:build')

export function onErrors(name: string, messages: string[]) {
  log(`✖️ Build ${name} failed`)
  messages.forEach((message) => {
    log(message)
  })
  console.error(name + ':\n' + messages.map((message) => `- ${message}`).join('\n'))
  process.exit(1)
}

export function onBunErrors(name: string, logs: (BuildMessage | ResolveMessage)[]) {
  onErrors(
    name,
    logs.map(({ message }) => message)
  )
}

export async function exec(command: string) {
  new Promise((resolve, reject) => {
    try {
      execSync(command)
      resolve(true)
    } catch (error) {
      reject(error)
    }
  })
}

export async function fixBunNodeBuild(file: string) {
  await exec(
    `bunx rexreplace '^(#!.+\\n)?' '$1import { createRequire as createImportMetaRequire } from "module"; import.meta.require ||= (id) => createImportMetaRequire(import.meta.url)(id);\\n' -GM ${file}`
  )
}
