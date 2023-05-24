import type { PagesInterface } from 'shared-page'

const mockPages: PagesInterface = {
  '/': {
    title: 'Home',
    metadata: {
      description: 'Home page',
    },

    components: {
      header: {},
    },
  },
  '/products': {
    title: 'Products',
    metadata: {
      description: 'Products page',
    },
    components: {
      header: {},
    },
  },
  '/customers': {
    title: 'Customers',
    components: {
      header: {},
    },
  },
}

jest.mock('server-common', () => ({
  ConfigUtils: {
    get: jest.fn(() => mockPages),
  },
}))

beforeEach(() => {
  jest.clearAllMocks()
})
