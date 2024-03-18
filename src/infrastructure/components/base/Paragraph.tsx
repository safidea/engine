import type { Props } from '@infrastructure/client/engine'
import type { Size } from '@domain/engine/page/component/base/Paragraph'
import { classNames } from '../utils'

export const Paragraph = ({ text, center, size = 'md', className = '' }: Props['Paragraph']) => {
  const classes = getClasses(size, center)
  return <p className={classNames(classes, className)}>{text}</p>
}

export function getClasses(size: Size, center = false) {
  const centerClasses = center ? 'text-center' : ''
  const sharedClasses = 'font-light text-gray-500 dark:text-gray-400'
  switch (size) {
    case 'xs':
      return classNames('text-xs', sharedClasses, centerClasses)
    case 'sm':
      return classNames('text-sm', sharedClasses, centerClasses)
    case 'md':
      return classNames('text-base', sharedClasses, centerClasses)
    case 'lg':
      return classNames('text-lg', sharedClasses, centerClasses)
    case 'xl':
      return classNames('text-xl', sharedClasses, centerClasses)
  }
}
