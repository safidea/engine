import './setup'
import { PageConfig, PageService } from '../../../src'
import { ComponentConfig } from 'server-component'
import { ConfigUtils } from 'server-common'

beforeAll(async () => {
  ConfigUtils.exec([ComponentConfig, PageConfig])
})

describe('on home page', () => {
  it('should have service defined', () => {
    expect(PageService).toBeDefined()
  })
})
