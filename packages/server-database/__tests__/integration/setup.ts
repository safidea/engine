import TestUtils from 'server-common/src/utils/test.utils'
import PathUtils from 'server-common/src/utils/path.utils'

jest.unmock('fs-extra')
jest.unmock('child_process')

PathUtils.getPackageAppFile = TestUtils.getPackageAppFile

beforeAll(TestUtils.beforeAll)
afterAll(TestUtils.afterAll)
