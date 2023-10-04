import React from 'react'
import { IIconDriver, IconProps } from '@adapters/mappers/driver/IIconDriver'
import { HomeIcon } from '@heroicons/react/24/solid'

export class HeroiconsIcon implements IIconDriver {
  readonly name = 'heroicons'

  getByName(name: string) {
    switch (name) {
      case 'home':
        return ({ className, size }: IconProps) => (
          <HomeIcon className={className} data-size={size} />
        )
      default:
        return ({ className, size }: IconProps) => (
          <HomeIcon className={className} data-size={size} />
        )
    }
  }
}
