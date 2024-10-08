import type { Props } from '@domain/entities/Component'
import { classNames } from '../utils'
import type { Size } from '@domain/entities/Component/base'

export const Spacer = ({ id, className = '', size = 'md' }: Props['Spacer']) => {
  return <div id={id} className={classNames(getSizeClasses(size), className)}></div>
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
