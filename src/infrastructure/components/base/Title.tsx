import type { Props } from '@domain/engine/page/component'
import { classNames, getTextAlignClasses } from '../utils'
import type { Size } from '@domain/engine/page/component/base/base'

export const Title = ({ size = 'md', text, align = 'left', className = '' }: Props['Title']) => {
  const classes = classNames(
    'font-bold text-gray-900',
    getTextSizeClasses(size),
    getMarginBottomClasses(size, className),
    getTextAlignClasses(align),
    className
  )
  switch (size) {
    case 'xs':
      return <h6 className={classes}>{text}</h6>
    case 'sm':
      return <h5 className={classes}>{text}</h5>
    case 'md':
      return <h4 className={classes}>{text}</h4>
    case 'lg':
      return <h3 className={classes}>{text}</h3>
    case 'xl':
      return <h2 className={classes}>{text}</h2>
    case '2xl':
      return <h1 className={classes}>{text}</h1>
  }
}

export function getTextSizeClasses(size: Size) {
  switch (size) {
    case 'xs':
      return 'text-xl'
    case 'sm':
      return 'text-2xl'
    case 'md':
      return 'text-3xl'
    case 'lg':
      return 'text-4xl'
    case 'xl':
      return 'text-5xl'
    case '2xl':
      return 'text-6xl'
  }
}

export function getMarginBottomClasses(size: Size, className: string) {
  if (className.includes('mb-')) return ''
  switch (size) {
    case 'xs':
      return 'mb-2'
    case 'sm':
      return 'mb-2'
    case 'md':
      return 'mb-4'
    case 'lg':
      return 'mb-4'
    case 'xl':
      return 'mb-6'
    case '2xl':
      return 'mb-6'
  }
}
