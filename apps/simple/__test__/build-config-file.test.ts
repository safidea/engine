import util from 'util'
import { exec } from 'child_process'

const execCommand = util.promisify(exec)

jest.setTimeout(20000)

test('return true', async () => {
  await execCommand('ts-node ./scripts/build-config-file.ts').catch((e) => {
    throw new Error(e)
  })
})
