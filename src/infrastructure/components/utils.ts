import type {
  Align,
  Breakpoint,
  Dimension,
  Font,
  Padding,
  RoundedSize,
  Size,
} from '@domain/engine/page/component/base/base'

export function classNames(...classes: (string | undefined)[]) {
  const filtered = classes.filter(Boolean)
  if (filtered.length === 0) return undefined
  return filtered.join(' ')
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

export function getTextSizeClasses(size: Size) {
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

export function getRoundedClasses(roundedSize: RoundedSize) {
  switch (roundedSize) {
    case 'sm':
      return 'rounded'
    case 'md':
      return 'rounded-md'
    case 'lg':
      return 'rounded-lg'
    case 'xl':
      return 'rounded-full'
  }
}

export function getFontClasses(font?: Font) {
  switch (font) {
    case 'sans':
      return 'font-sans'
    case 'serif':
      return 'font-serif'
    case 'mono':
      return 'font-mono'
    default:
      return ''
  }
}

export function center({
  dimension,
  breakpoint,
}: {
  dimension?: Dimension
  breakpoint?: Breakpoint
}) {
  const baseClass = dimension ? `${dimension}` : ''
  const breakpointClass = breakpoint ? `${breakpoint}:` : ''
  return `${breakpointClass}m${baseClass}-auto`
}

export function padding({
  size,
  dimension,
  breakpoint,
}: {
  size: Padding
  dimension?: Dimension
  breakpoint?: Breakpoint
}) {
  const baseClass = dimension ? `${dimension}` : ''
  const breakpointClass = breakpoint ? `${breakpoint}:` : ''
  return `${breakpointClass}p${baseClass}-${size}`
}
