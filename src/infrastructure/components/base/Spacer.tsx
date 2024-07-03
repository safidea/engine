import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'
import type { Size } from '@domain/engine/page/component/base/base'

export const Spacer = ({ id, className = '', size = 'md' }: Props['Spacer']) => {
  return <div id={id} className={classNames(getSizeClasses(size), className)} data-component="Spacer"></div>
}

export function getSizeClasses(size: Size) {
  switch (size) {
    case 'xs':
      return 'mt-4'
    case 'sm':
      return 'mt-6'
    case 'md':
      return 'mt-8'
    case 'lg':
      return 'mt-12'
    case 'xl':
      return 'mt-16'
    case '2xl':
      return 'mt-20'
  }
}
