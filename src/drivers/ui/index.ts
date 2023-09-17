import UnstyledUI from './UnstyledUI'
import TailwindUI from './TailwindUI'
import { IUIDriver } from '@adapters/services/ui/IUIDriver'

export type UIDrivers = 'unstyled' | 'tailwind'

export function getUIDriver(ui: UIDrivers = 'unstyled'): IUIDriver {
  switch (ui) {
    case 'tailwind':
      return TailwindUI
    case 'unstyled':
      return UnstyledUI
    default:
      throw new Error(`UI driver '${ui}' not found`)
  }
}
