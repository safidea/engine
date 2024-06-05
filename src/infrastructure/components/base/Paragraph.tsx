import type { Props } from '@domain/engine/page/component'
import { classNames, getTextAlignClass } from '../utils'
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
        getTextClass(size),
        getTextAlignClass(align),
        className
      )}
    >
      {text}
    </p>
  )
}

export function getTextClass(size: Size) {
  switch (size) {
    case 'xs':
      return 'text-xs'
    case 'sm':
      return 'text-sm'
    case 'md':
      return 'text-base'
    case 'lg':
      return 'text-lg'
    case 'xl':
      return 'text-xl'
    case '2xl':
      return 'text-2xl'
  }
}
