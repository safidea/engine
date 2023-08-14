import { clearTmpFolders } from './helpers'

async function globalTeardown() {
  clearTmpFolders()
}

export default globalTeardown
