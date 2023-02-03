import util from 'util'
import { exec } from 'child_process'

const execCommand = util.promisify(exec)

jest.setTimeout(15000)

test('return true', async () => {
  await execCommand('ts-node ./scripts/import-components.ts').catch((e) => {
    throw new Error(e)
  })
})
