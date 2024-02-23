import { UnstyledUI } from './UnstyledUI'
import { TailwindUI } from './TailwindUI'
import { IUIDriver } from '@adapters/mappers/ui/IUIDriver'
import { UIDrivers } from '@entities/services/ui/UIDrivers'
import { IIconDriver } from '@adapters/mappers/driver/IIconDriver'

export function getUIDriver(ui: UIDrivers = 'unstyled', icon: IIconDriver): IUIDriver {
  switch (ui) {
    case 'tailwind':
      return new TailwindUI(icon)
    case 'unstyled':
      return new UnstyledUI(icon)
    default:
      throw new Error(`UI driver '${ui}' not found`)
  }
}
