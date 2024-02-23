import { HeroiconsIcon } from './HeroiconsIcon'
import { IconDrivers } from '@entities/services/icon/IconDrivers'
import { IIconDriver } from '@adapters/mappers/driver/IIconDriver'

export function getIconDriver(icon: IconDrivers = 'heroicons'): IIconDriver {
  switch (icon) {
    case 'heroicons':
      return new HeroiconsIcon()
    default:
      throw new Error(`Icon driver '${icon}' not found`)
  }
}
