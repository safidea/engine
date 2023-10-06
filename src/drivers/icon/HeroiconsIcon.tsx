import React from 'react'
import { IIconDriver, IconProps } from '@adapters/mappers/driver/IIconDriver'
import { HomeIcon, ArrowRightIcon } from '@heroicons/react/24/solid'
import { IconLibrary } from '@entities/services/icon/IconLibrary'

export class HeroiconsIcon implements IIconDriver {
  readonly name = 'heroicons'

  getIcon(name: IconLibrary) {
    switch (name) {
      case 'home':
        return HomeIcon
      case 'arrow-right':
        return ArrowRightIcon
    }
  }

  getByName(name: IconLibrary) {
    const Icon = this.getIcon(name)
    return ({ className, size }: IconProps) => <Icon className={className} data-size={size} />
  }
}
