import type { Props } from '@domain/entities/Component'
import { classNames, getFontClasses, getTextAlignClasses } from '../utils'
import type { Size } from '@domain/entities/Component/base'

export const Title = ({
  id,
  size = 'md',
  text,
  align = 'left',
  className = '',
  heading = getDefaultHeading(size),
  font,
}: Props['Title']) => {
  const classes = classNames(
    'font-bold text-gray-900',
    getFontClasses(font),
    getTextSizeClasses(size),
    getMarginBottomClasses(size, className),
    getTextAlignClasses(align),
    className
  )
  const props = { id, className: classes }
  switch (heading) {
    case 1:
      return <h1 {...props}>{text}</h1>
    case 2:
      return <h2 {...props}>{text}</h2>
    case 3:
      return <h3 {...props}>{text}</h3>
    case 4:
      return <h4 {...props}>{text}</h4>
    case 5:
      return <h5 {...props}>{text}</h5>
    default:
      return <h6 {...props}>{text}</h6>
  }
}

function getDefaultHeading(size: Size) {
  switch (size) {
    case 'xs':
      return 6
    case 'sm':
      return 6
    case 'md':
      return 3
    case 'lg':
      return 3
    case 'xl':
      return 2
    case '2xl':
      return 1
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
