/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs')
const path = require('path')

// The directory containing your compiled .js files
const OUTPUT_DIR = path.resolve(__dirname, '../', 'dist')

// Define your aliases and their absolute paths
const ALIAS_MAP = {
  '@domain/': path.resolve(OUTPUT_DIR, 'domain') + '/',
  '@infrastructure/': path.resolve(OUTPUT_DIR, 'infrastructure') + '/',
  '@application/': path.resolve(OUTPUT_DIR, 'application') + '/',
  '@adapter/': path.resolve(OUTPUT_DIR, 'adapter') + '/',
}

function replaceAliasesWithRelativePaths(filePath) {
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

function processDirectory(directory) {
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

processDirectory(OUTPUT_DIR)
