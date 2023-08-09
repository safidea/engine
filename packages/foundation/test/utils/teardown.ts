import { clearTmpFolders } from './helpers/tmp'

async function globalTeardown() {
  clearTmpFolders()
}

export default globalTeardown
