import { TestUtils } from 'server-common'

jest.unmock('fs-extra')
jest.unmock('child_process')

beforeAll(TestUtils.beforeAll)

afterAll(TestUtils.afterAll)
