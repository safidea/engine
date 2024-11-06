import type { Driver } from '@adapter/spi/drivers/IconLibrarySpi'
import type { Name } from '@domain/libraries/Icon'
import * as outline from '@heroicons/react/24/outline'
import * as solid from '@heroicons/react/24/solid'

export class IconLibraryDriver implements Driver {
  outline = (name: Name) => {
    return outline[`${name}Icon`]
  }

  solid = (name: Name) => {
    return solid[`${name}Icon`]
  }
}
