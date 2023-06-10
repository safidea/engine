import { PageRoute } from 'client-page'

import type { ConfigInterface } from 'shared-app'

interface CustomComponents {
  Image: React.FC
  Link: React.FC
}

class AppClient {
  customComponents: CustomComponents

  constructor({ customComponents }) {
    this.customComponents = customComponents
  }

  pageHandler(path: string, config: ConfigInterface) {
    return PageRoute.render(path, config, this.customComponents)
  }
}

export default AppClient
