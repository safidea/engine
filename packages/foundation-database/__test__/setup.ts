import fs from 'fs-extra';
import { join } from 'path'
import { randomBytes } from 'crypto'

const fileName = `test-${randomBytes(8).toString('hex')}.db`
const folderData = join(__dirname, '..', '__test__/data')
const testDatabaseUrl = `file:${join(folderData, fileName)}`

jest.setTimeout(10000)

beforeAll(async () => {
  fs.mkdirSync(folderData)
  fs.writeFileSync(join(folderData, fileName), '')
})

afterAll(async () => {
  fs.unlinkSync(join(folderData, fileName))
  fs.rmdirSync(folderData)
})

export { testDatabaseUrl }