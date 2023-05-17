import './setup'
import { PageConfig, PageRoute } from '../../../src'
import { ComponentConfig } from 'server-component'
import { ConfigUtils } from 'server-common'

beforeAll(async () => {
  ConfigUtils.exec([ComponentConfig, PageConfig])
})

describe('on home page', () => {
  it('should have routes defined', () => {
    expect(PageRoute).toBeDefined()
  })
})
