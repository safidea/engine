import { deleteFilesRecursively, exec, log } from '../helpers'
import path from 'path'
import fs from 'fs-extra'

log('Start building types...')

const __dirname = new URL('.', import.meta.url).pathname
const OUTPUT_DIR = path.resolve(process.cwd(), 'dist')
const ALIAS_MAP = {
  '@domain/': path.resolve(OUTPUT_DIR, 'domain') + '/',
  '@adapter/': path.resolve(OUTPUT_DIR, 'adapter') + '/',
  '@infrastructure/': path.resolve(OUTPUT_DIR, 'infrastructure') + '/',
}

function replaceAliasesWithRelativePaths(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8')

  for (const [alias, absolutePath] of Object.entries(ALIAS_MAP)) {
    const relativePath = path.relative(path.dirname(filePath), absolutePath)
    // Convert Windows paths to POSIX (replace backslashes with slashes)
    let posixRelativePath = relativePath.split(path.sep).join('/')
    if (posixRelativePath.search(/^\./) === -1) posixRelativePath = './' + posixRelativePath
    const regex = new RegExp(alias, 'g')
    content = content.replace(regex, posixRelativePath + '/')
  }

  fs.writeFileSync(filePath, content)
}

function processDirectory(directory: string) {
  fs.readdirSync(directory).forEach((item) => {
    const itemPath = path.join(directory, item)
    const stat = fs.statSync(itemPath)

    if (stat.isDirectory()) {
      // If it's a directory, process it recursively
      processDirectory(itemPath)
    } else if (item.endsWith('.js') || item.endsWith('.d.ts')) {
      // If it's a .js or .d.ts file, replace the aliases with relative paths
      replaceAliasesWithRelativePaths(itemPath)
    }
  })
}

await deleteFilesRecursively('dist', '.d.ts')
await exec(`tsc --project ${path.join(__dirname, 'tsconfig.json')}`)
processDirectory(OUTPUT_DIR)

log(`✓ Types builded`)
