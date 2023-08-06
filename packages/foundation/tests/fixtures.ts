import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { describe, test, expect, afterAll } from '@jest/globals'
import fs from 'fs-extra'

const tmpFolders: string[] = []
const helpers = {
  getTmpFolder: () => {
    const tmpFolder = join(__dirname, 'tmp/' + uuidv4())
    fs.ensureDirSync(tmpFolder)
    tmpFolders.push(tmpFolder)
    return tmpFolder
  },
}

afterAll(async () => {
  await Promise.all(tmpFolders.map((tmpFolders) => fs.remove(tmpFolders)))
})

export { helpers, describe, test, expect }
