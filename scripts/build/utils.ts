import debug from 'debug'
import { exec as execSync } from 'child_process'
import { promisify } from 'util'
import fs from 'fs-extra'
import path from 'path'

await fs.ensureDir('dist')

export const log = debug('engine:build')
export const exec = promisify(execSync)

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

export function capitalize(str: string) {
  if (str && typeof str === 'string') {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  return str
}

export async function deleteFilesRecursively(directoryPath: string, extname: string) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true })
  for (const entry of entries) {
    const entryPath = path.join(directoryPath, entry.name)
    if (entry.isDirectory()) {
      await deleteFilesRecursively(entryPath, extname)
    } else if (entry.isFile() && path.extname(entry.name) === extname) {
      await fs.unlink(entryPath)
    }
  }
}
