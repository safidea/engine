import type { IconName } from '@domain/libraries/Icon'
import * as outline from '@heroicons/react/24/outline'
import * as solid from '@heroicons/react/24/solid'

export class IconLibraryDriver {
  outline(name: IconName) {
    return outline[`${name}Icon`]
  }

  solid(name: IconName) {
    return solid[`${name}Icon`]
  }
}
