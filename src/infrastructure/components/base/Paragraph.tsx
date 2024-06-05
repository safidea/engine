import type { Props } from '@domain/engine/page/component'
import { classNames, getTextAlignClasses } from '../utils'
import type { Size } from '@domain/engine/page/component/base/base'

export const Paragraph = ({
  id,
  text,
  align = 'left',
  size = 'md',
  className = '',
}: Props['Paragraph']) => {
  return (
    <p
      id={id}
      className={classNames(
        'font-light text-gray-500 dark:text-gray-400',
        getTextClasses(size),
        getTextAlignClasses(align),
        className
      )}
    >
      {text}
    </p>
  )
}

export function getTextClasses(size: Size) {
  switch (size) {
    case 'xs':
      return 'text-xs mb-2'
    case 'sm':
      return 'text-sm mb-2'
    case 'md':
      return 'text-base mb-4'
    case 'lg':
      return 'text-lg mb-4'
    case 'xl':
      return 'text-xl mb-6'
    case '2xl':
      return 'text-2xl mb-6'
  }
}
