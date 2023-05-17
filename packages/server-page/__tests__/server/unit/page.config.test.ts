import PageConfig from '@page/configs/page.config'
import { ConfigUtils } from '@common/server'

import type { PagesInterface } from '@page'

const pages: PagesInterface = {
  '/': {
    head: {
      title: 'Home',
    },
    body: {
      components: {
        hero: {},
      },
    },
  },
}

beforeEach(() => {
  jest.clearAllMocks()
  ConfigUtils.set('pages', pages)
})

describe('enrich', () => {
  it('should enrich config', () => {
    PageConfig.enrich()
  })
})

describe('validate', () => {
  it('should throw error', () => {
    ConfigUtils.set('pages', { '/': 'test' })
    try {
      PageConfig.validate()
    } catch (e: any) {
      expect(e.message).toContain('must be object')
    }
  })

  it('should not throw error', () => {
    PageConfig.validate()
  })
})

describe('lib', () => {
  it('should config lib', () => {
    PageConfig.lib()
  })
})

describe('js', () => {
  it('should generate js', () => {
    PageConfig.js()
  })
})
