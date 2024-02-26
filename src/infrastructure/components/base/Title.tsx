import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'

export const Title = ({ size, text, center, className = '', ...props }: Props['Title']) => {
  const classes = getClasses(size, center)
  switch (size) {
    case 'xs':
      return (
        <h6 {...props} className={classNames(classes, className)}>
          {text}
        </h6>
      )
    case 'sm':
      return (
        <h5 {...props} className={classNames(classes, className)}>
          {text}
        </h5>
      )
    case 'md':
      return (
        <h4 {...props} className={classNames(classes, className)}>
          {text}
        </h4>
      )
    case 'lg':
      return (
        <h3 {...props} className={classNames(classes, className)}>
          {text}
        </h3>
      )
    case 'xl':
      return (
        <h2 {...props} className={classNames(classes, className)}>
          {text}
        </h2>
      )
    case '2xl':
      return (
        <h1 {...props} className={classNames(classes, className)}>
          {text}
        </h1>
      )
  }
}

export function getClasses(size: Props['Title']['size'] = '2xl', center = false) {
  const centerClasses = center ? 'text-center' : ''
  const sharedClasses = 'font-bold text-gray-900'
  switch (size) {
    case 'xs':
      return classNames('text-xl', sharedClasses, centerClasses)
    case 'sm':
      return classNames('text-2xl', sharedClasses, centerClasses)
    case 'md':
      return classNames('text-3xl', sharedClasses, centerClasses)
    case 'lg':
      return classNames('text-4xl', sharedClasses, centerClasses)
    case 'xl':
      return classNames('text-5xl', sharedClasses, centerClasses)
    case '2xl':
      return classNames('text-6xl', sharedClasses, centerClasses)
  }
}
