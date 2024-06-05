import type { Align } from '@domain/engine/page/component/base/base'

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function getTextAlignClasses(align: Align) {
  switch (align) {
    case 'left':
      return 'text-left'
    case 'center':
      return 'text-center'
    case 'right':
      return 'text-right'
  }
}
