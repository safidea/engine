import type {
  Align,
  Breakpoint,
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
  dimension?: 'x' | 'y' | 't' | 'b' | 'l' | 'r'
  breakpoint?: Breakpoint
}) {
  switch (dimension) {
    case 'x':
      switch (breakpoint) {
        case 'sm':
          return 'sm:mx-auto'
        case 'md':
          return 'md:mx-auto'
        case 'lg':
          return 'lg:mx-auto'
        case 'xl':
          return 'xl:mx-auto'
        case '2xl':
          return '2xl:mx-auto'
        default:
          return 'mx-auto'
      }
    case 'y':
      switch (breakpoint) {
        case 'sm':
          return 'sm:my-auto'
        case 'md':
          return 'md:my-auto'
        case 'lg':
          return 'lg:my-auto'
        case 'xl':
          return 'xl:my-auto'
        case '2xl':
          return '2xl:my-auto'
        default:
          return 'my-auto'
      }
    case 't':
      switch (breakpoint) {
        case 'sm':
          return 'sm:mt-auto'
        case 'md':
          return 'md:mt-auto'
        case 'lg':
          return 'lg:mt-auto'
        case 'xl':
          return 'xl:mt-auto'
        case '2xl':
          return '2xl:mt-auto'
        default:
          return 'mt-auto'
      }
    case 'b':
      switch (breakpoint) {
        case 'sm':
          return 'sm:mb-auto'
        case 'md':
          return 'md:mb-auto'
        case 'lg':
          return 'lg:mb-auto'
        case 'xl':
          return 'xl:mb-auto'
        case '2xl':
          return '2xl:mb-auto'
        default:
          return 'mb-auto'
      }
    case 'l':
      switch (breakpoint) {
        case 'sm':
          return 'sm:ml-auto'
        case 'md':
          return 'md:ml-auto'
        case 'lg':
          return 'lg:ml-auto'
        case 'xl':
          return 'xl:ml-auto'
        case '2xl':
          return '2xl:ml-auto'
        default:
          return 'ml-auto'
      }
    case 'r':
      switch (breakpoint) {
        case 'sm':
          return 'sm:mr-auto'
        case 'md':
          return 'md:mr-auto'
        case 'lg':
          return 'lg:mr-auto'
        case 'xl':
          return 'xl:mr-auto'
        case '2xl':
          return '2xl:mr-auto'
        default:
          return 'mr-auto'
      }
    default:
      switch (breakpoint) {
        case 'sm':
          return 'sm:m-auto'
        case 'md':
          return 'md:m-auto'
        case 'lg':
          return 'lg:m-auto'
        case 'xl':
          return 'xl:m-auto'
        case '2xl':
          return '2xl:m-auto'
        default:
          return 'm-auto'
      }
  }
}

export function padding({
  size,
  dimension,
  breakpoint,
}: {
  size: Padding
  dimension?: 'x' | 'y' | 't' | 'b' | 'l' | 'r'
  breakpoint?: Breakpoint
}) {
  switch (size) {
    case '0':
      switch (dimension) {
        case 'x':
          switch (breakpoint) {
            case 'sm':
              return 'sm:px-0'
            case 'md':
              return 'md:px-0'
            case 'lg':
              return 'lg:px-0'
            case 'xl':
              return 'xl:px-0'
            case '2xl':
              return '2xl:px-0'
            default:
              return 'px-0'
          }
        case 'y':
          switch (breakpoint) {
            case 'sm':
              return 'sm:py-0'
            case 'md':
              return 'md:py-0'
            case 'lg':
              return 'lg:py-0'
            case 'xl':
              return 'xl:py-0'
            case '2xl':
              return '2xl:py-0'
            default:
              return 'py-0'
          }
        case 't':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pt-0'
            case 'md':
              return 'md:pt-0'
            case 'lg':
              return 'lg:pt-0'
            case 'xl':
              return 'xl:pt-0'
            case '2xl':
              return '2xl:pt-0'
            default:
              return 'pt-0'
          }
        case 'b':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pb-0'
            case 'md':
              return 'md:pb-0'
            case 'lg':
              return 'lg:pb-0'
            case 'xl':
              return 'xl:pb-0'
            case '2xl':
              return '2xl:pb-0'
            default:
              return 'pb-0'
          }
        case 'l':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pl-0'
            case 'md':
              return 'md:pl-0'
            case 'lg':
              return 'lg:pl-0'
            case 'xl':
              return 'xl:pl-0'
            case '2xl':
              return '2xl:pl-0'
            default:
              return 'pl-0'
          }
        case 'r':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pr-0'
            case 'md':
              return 'md:pr-0'
            case 'lg':
              return 'lg:pr-0'
            case 'xl':
              return 'xl:pr-0'
            case '2xl':
              return '2xl:pr-0'
            default:
              return 'pr-0'
          }
        default:
          switch (breakpoint) {
            case 'sm':
              return 'sm:p-0'
            case 'md':
              return 'md:p-0'
            case 'lg':
              return 'lg:p-0'
            case 'xl':
              return 'xl:p-0'
            case '2xl':
              return '2xl:p-0'
            default:
              return 'p-0'
          }
      }
    case 'px':
      switch (dimension) {
        case 'x':
          switch (breakpoint) {
            case 'sm':
              return 'sm:px-px'
            case 'md':
              return 'md:px-px'
            case 'lg':
              return 'lg:px-px'
            case 'xl':
              return 'xl:px-px'
            case '2xl':
              return '2xl:px-px'
            default:
              return 'px-px'
          }
        case 'y':
          switch (breakpoint) {
            case 'sm':
              return 'sm:py-px'
            case 'md':
              return 'md:py-px'
            case 'lg':
              return 'lg:py-px'
            case 'xl':
              return 'xl:py-px'
            case '2xl':
              return '2xl:py-px'
            default:
              return 'py-px'
          }
        case 't':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pt-px'
            case 'md':
              return 'md:pt-px'
            case 'lg':
              return 'lg:pt-px'
            case 'xl':
              return 'xl:pt-px'
            case '2xl':
              return '2xl:pt-px'
            default:
              return 'pt-px'
          }
        case 'b':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pb-px'
            case 'md':
              return 'md:pb-px'
            case 'lg':
              return 'lg:pb-px'
            case 'xl':
              return 'xl:pb-px'
            case '2xl':
              return '2xl:pb-px'
            default:
              return 'pb-px'
          }
        case 'l':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pl-px'
            case 'md':
              return 'md:pl-px'
            case 'lg':
              return 'lg:pl-px'
            case 'xl':
              return 'xl:pl-px'
            case '2xl':
              return '2xl:pl-px'
            default:
              return 'pl-px'
          }
        case 'r':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pr-px'
            case 'md':
              return 'md:pr-px'
            case 'lg':
              return 'lg:pr-px'
            case 'xl':
              return 'xl:pr-px'
            case '2xl':
              return '2xl:pr-px'
            default:
              return 'pr-px'
          }
        default:
          switch (breakpoint) {
            case 'sm':
              return 'sm:p-px'
            case 'md':
              return 'md:p-px'
            case 'lg':
              return 'lg:p-px'
            case 'xl':
              return 'xl:p-px'
            case '2xl':
              return '2xl:p-px'
            default:
              return 'p-px'
          }
      }
    case '0.5':
      switch (dimension) {
        case 'x':
          switch (breakpoint) {
            case 'sm':
              return 'sm:px-0.5'
            case 'md':
              return 'md:px-0.5'
            case 'lg':
              return 'lg:px-0.5'
            case 'xl':
              return 'xl:px-0.5'
            case '2xl':
              return '2xl:px-0.5'
            default:
              return 'px-0.5'
          }
        case 'y':
          switch (breakpoint) {
            case 'sm':
              return 'sm:py-0.5'
            case 'md':
              return 'md:py-0.5'
            case 'lg':
              return 'lg:py-0.5'
            case 'xl':
              return 'xl:py-0.5'
            case '2xl':
              return '2xl:py-0.5'
            default:
              return 'py-0.5'
          }
        case 't':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pt-0.5'
            case 'md':
              return 'md:pt-0.5'
            case 'lg':
              return 'lg:pt-0.5'
            case 'xl':
              return 'xl:pt-0.5'
            case '2xl':
              return '2xl:pt-0.5'
            default:
              return 'pt-0.5'
          }
        case 'b':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pb-0.5'
            case 'md':
              return 'md:pb-0.5'
            case 'lg':
              return 'lg:pb-0.5'
            case 'xl':
              return 'xl:pb-0.5'
            case '2xl':
              return '2xl:pb-0.5'
            default:
              return 'pb-0.5'
          }
        case 'l':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pl-0.5'
            case 'md':
              return 'md:pl-0.5'
            case 'lg':
              return 'lg:pl-0.5'
            case 'xl':
              return 'xl:pl-0.5'
            case '2xl':
              return '2xl:pl-0.5'
            default:
              return 'pl-0.5'
          }
        case 'r':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pr-0.5'
            case 'md':
              return 'md:pr-0.5'
            case 'lg':
              return 'lg:pr-0.5'
            case 'xl':
              return 'xl:pr-0.5'
            case '2xl':
              return '2xl:pr-0.5'
            default:
              return 'pr-0.5'
          }
        default:
          switch (breakpoint) {
            case 'sm':
              return 'sm:p-0.5'
            case 'md':
              return 'md:p-0.5'
            case 'lg':
              return 'lg:p-0.5'
            case 'xl':
              return 'xl:p-0.5'
            case '2xl':
              return '2xl:p-0.5'
            default:
              return 'p-0.5'
          }
      }
    // Repeat similar structures for '1', '1.5', '2', ..., '96'
    case '1':
      switch (dimension) {
        case 'x':
          switch (breakpoint) {
            case 'sm':
              return 'sm:px-1'
            case 'md':
              return 'md:px-1'
            case 'lg':
              return 'lg:px-1'
            case 'xl':
              return 'xl:px-1'
            case '2xl':
              return '2xl:px-1'
            default:
              return 'px-1'
          }
        case 'y':
          switch (breakpoint) {
            case 'sm':
              return 'sm:py-1'
            case 'md':
              return 'md:py-1'
            case 'lg':
              return 'lg:py-1'
            case 'xl':
              return 'xl:py-1'
            case '2xl':
              return '2xl:py-1'
            default:
              return 'py-1'
          }
        case 't':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pt-1'
            case 'md':
              return 'md:pt-1'
            case 'lg':
              return 'lg:pt-1'
            case 'xl':
              return 'xl:pt-1'
            case '2xl':
              return '2xl:pt-1'
            default:
              return 'pt-1'
          }
        case 'b':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pb-1'
            case 'md':
              return 'md:pb-1'
            case 'lg':
              return 'lg:pb-1'
            case 'xl':
              return 'xl:pb-1'
            case '2xl':
              return '2xl:pb-1'
            default:
              return 'pb-1'
          }
        case 'l':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pl-1'
            case 'md':
              return 'md:pl-1'
            case 'lg':
              return 'lg:pl-1'
            case 'xl':
              return 'xl:pl-1'
            case '2xl':
              return '2xl:pl-1'
            default:
              return 'pl-1'
          }
        case 'r':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pr-1'
            case 'md':
              return 'md:pr-1'
            case 'lg':
              return 'lg:pr-1'
            case 'xl':
              return 'xl:pr-1'
            case '2xl':
              return '2xl:pr-1'
            default:
              return 'pr-1'
          }
        default:
          switch (breakpoint) {
            case 'sm':
              return 'sm:p-1'
            case 'md':
              return 'md:p-1'
            case 'lg':
              return 'lg:p-1'
            case 'xl':
              return 'xl:p-1'
            case '2xl':
              return '2xl:p-1'
            default:
              return 'p-1'
          }
      }
    case '1.5':
      switch (dimension) {
        case 'x':
          switch (breakpoint) {
            case 'sm':
              return 'sm:px-1.5'
            case 'md':
              return 'md:px-1.5'
            case 'lg':
              return 'lg:px-1.5'
            case 'xl':
              return 'xl:px-1.5'
            case '2xl':
              return '2xl:px-1.5'
            default:
              return 'px-1.5'
          }
        case 'y':
          switch (breakpoint) {
            case 'sm':
              return 'sm:py-1.5'
            case 'md':
              return 'md:py-1.5'
            case 'lg':
              return 'lg:py-1.5'
            case 'xl':
              return 'xl:py-1.5'
            case '2xl':
              return '2xl:py-1.5'
            default:
              return 'py-1.5'
          }
        case 't':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pt-1.5'
            case 'md':
              return 'md:pt-1.5'
            case 'lg':
              return 'lg:pt-1.5'
            case 'xl':
              return 'xl:pt-1.5'
            case '2xl':
              return '2xl:pt-1.5'
            default:
              return 'pt-1.5'
          }
        case 'b':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pb-1.5'
            case 'md':
              return 'md:pb-1.5'
            case 'lg':
              return 'lg:pb-1.5'
            case 'xl':
              return 'xl:pb-1.5'
            case '2xl':
              return '2xl:pb-1.5'
            default:
              return 'pb-1.5'
          }
        case 'l':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pl-1.5'
            case 'md':
              return 'md:pl-1.5'
            case 'lg':
              return 'lg:pl-1.5'
            case 'xl':
              return 'xl:pl-1.5'
            case '2xl':
              return '2xl:pl-1.5'
            default:
              return 'pl-1.5'
          }
        case 'r':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pr-1.5'
            case 'md':
              return 'md:pr-1.5'
            case 'lg':
              return 'lg:pr-1.5'
            case 'xl':
              return 'xl:pr-1.5'
            case '2xl':
              return '2xl:pr-1.5'
            default:
              return 'pr-1.5'
          }
        default:
          switch (breakpoint) {
            case 'sm':
              return 'sm:p-1.5'
            case 'md':
              return 'md:p-1.5'
            case 'lg':
              return 'lg:p-1.5'
            case 'xl':
              return 'xl:p-1.5'
            case '2xl':
              return '2xl:p-1.5'
            default:
              return 'p-1.5'
          }
      }
    case '2':
      switch (dimension) {
        case 'x':
          switch (breakpoint) {
            case 'sm':
              return 'sm:px-2'
            case 'md':
              return 'md:px-2'
            case 'lg':
              return 'lg:px-2'
            case 'xl':
              return 'xl:px-2'
            case '2xl':
              return '2xl:px-2'
            default:
              return 'px-2'
          }
        case 'y':
          switch (breakpoint) {
            case 'sm':
              return 'sm:py-2'
            case 'md':
              return 'md:py-2'
            case 'lg':
              return 'lg:py-2'
            case 'xl':
              return 'xl:py-2'
            case '2xl':
              return '2xl:py-2'
            default:
              return 'py-2'
          }
        case 't':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pt-2'
            case 'md':
              return 'md:pt-2'
            case 'lg':
              return 'lg:pt-2'
            case 'xl':
              return 'xl:pt-2'
            case '2xl':
              return '2xl:pt-2'
            default:
              return 'pt-2'
          }
        case 'b':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pb-2'
            case 'md':
              return 'md:pb-2'
            case 'lg':
              return 'lg:pb-2'
            case 'xl':
              return 'xl:pb-2'
            case '2xl':
              return '2xl:pb-2'
            default:
              return 'pb-2'
          }
        case 'l':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pl-2'
            case 'md':
              return 'md:pl-2'
            case 'lg':
              return 'lg:pl-2'
            case 'xl':
              return 'xl:pl-2'
            case '2xl':
              return '2xl:pl-2'
            default:
              return 'pl-2'
          }
        case 'r':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pr-2'
            case 'md':
              return 'md:pr-2'
            case 'lg':
              return 'lg:pr-2'
            case 'xl':
              return 'xl:pr-2'
            case '2xl':
              return '2xl:pr-2'
            default:
              return 'pr-2'
          }
        default:
          switch (breakpoint) {
            case 'sm':
              return 'sm:p-2'
            case 'md':
              return 'md:p-2'
            case 'lg':
              return 'lg:p-2'
            case 'xl':
              return 'xl:p-2'
            case '2xl':
              return '2xl:p-2'
            default:
              return 'p-2'
          }
      }
    case '2.5':
      switch (dimension) {
        case 'x':
          switch (breakpoint) {
            case 'sm':
              return 'sm:px-2.5'
            case 'md':
              return 'md:px-2.5'
            case 'lg':
              return 'lg:px-2.5'
            case 'xl':
              return 'xl:px-2.5'
            case '2xl':
              return '2xl:px-2.5'
            default:
              return 'px-2.5'
          }
        case 'y':
          switch (breakpoint) {
            case 'sm':
              return 'sm:py-2.5'
            case 'md':
              return 'md:py-2.5'
            case 'lg':
              return 'lg:py-2.5'
            case 'xl':
              return 'xl:py-2.5'
            case '2xl':
              return '2xl:py-2.5'
            default:
              return 'py-2.5'
          }
        case 't':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pt-2.5'
            case 'md':
              return 'md:pt-2.5'
            case 'lg':
              return 'lg:pt-2.5'
            case 'xl':
              return 'xl:pt-2.5'
            case '2xl':
              return '2xl:pt-2.5'
            default:
              return 'pt-2.5'
          }
        case 'b':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pb-2.5'
            case 'md':
              return 'md:pb-2.5'
            case 'lg':
              return 'lg:pb-2.5'
            case 'xl':
              return 'xl:pb-2.5'
            case '2xl':
              return '2xl:pb-2.5'
            default:
              return 'pb-2.5'
          }
        case 'l':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pl-2.5'
            case 'md':
              return 'md:pl-2.5'
            case 'lg':
              return 'lg:pl-2.5'
            case 'xl':
              return 'xl:pl-2.5'
            case '2xl':
              return '2xl:pl-2.5'
            default:
              return 'pl-2.5'
          }
        case 'r':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pr-2.5'
            case 'md':
              return 'md:pr-2.5'
            case 'lg':
              return 'lg:pr-2.5'
            case 'xl':
              return 'xl:pr-2.5'
            case '2xl':
              return '2xl:pr-2.5'
            default:
              return 'pr-2.5'
          }
        default:
          switch (breakpoint) {
            case 'sm':
              return 'sm:p-2.5'
            case 'md':
              return 'md:p-2.5'
            case 'lg':
              return 'lg:p-2.5'
            case 'xl':
              return 'xl:p-2.5'
            case '2xl':
              return '2xl:p-2.5'
            default:
              return 'p-2.5'
          }
      }
    case '3':
      switch (dimension) {
        case 'x':
          switch (breakpoint) {
            case 'sm':
              return 'sm:px-3'
            case 'md':
              return 'md:px-3'
            case 'lg':
              return 'lg:px-3'
            case 'xl':
              return 'xl:px-3'
            case '2xl':
              return '2xl:px-3'
            default:
              return 'px-3'
          }
        case 'y':
          switch (breakpoint) {
            case 'sm':
              return 'sm:py-3'
            case 'md':
              return 'md:py-3'
            case 'lg':
              return 'lg:py-3'
            case 'xl':
              return 'xl:py-3'
            case '2xl':
              return '2xl:py-3'
            default:
              return 'py-3'
          }
        case 't':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pt-3'
            case 'md':
              return 'md:pt-3'
            case 'lg':
              return 'lg:pt-3'
            case 'xl':
              return 'xl:pt-3'
            case '2xl':
              return '2xl:pt-3'
            default:
              return 'pt-3'
          }
        case 'b':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pb-3'
            case 'md':
              return 'md:pb-3'
            case 'lg':
              return 'lg:pb-3'
            case 'xl':
              return 'xl:pb-3'
            case '2xl':
              return '2xl:pb-3'
            default:
              return 'pb-3'
          }
        case 'l':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pl-3'
            case 'md':
              return 'md:pl-3'
            case 'lg':
              return 'lg:pl-3'
            case 'xl':
              return 'xl:pl-3'
            case '2xl':
              return '2xl:pl-3'
            default:
              return 'pl-3'
          }
        case 'r':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pr-3'
            case 'md':
              return 'md:pr-3'
            case 'lg':
              return 'lg:pr-3'
            case 'xl':
              return 'xl:pr-3'
            case '2xl':
              return '2xl:pr-3'
            default:
              return 'pr-3'
          }
        default:
          switch (breakpoint) {
            case 'sm':
              return 'sm:p-3'
            case 'md':
              return 'md:p-3'
            case 'lg':
              return 'lg:p-3'
            case 'xl':
              return 'xl:p-3'
            case '2xl':
              return '2xl:p-3'
            default:
              return 'p-3'
          }
      }
    case '3.5':
      switch (dimension) {
        case 'x':
          switch (breakpoint) {
            case 'sm':
              return 'sm:px-3.5'
            case 'md':
              return 'md:px-3.5'
            case 'lg':
              return 'lg:px-3.5'
            case 'xl':
              return 'xl:px-3.5'
            case '2xl':
              return '2xl:px-3.5'
            default:
              return 'px-3.5'
          }
        case 'y':
          switch (breakpoint) {
            case 'sm':
              return 'sm:py-3.5'
            case 'md':
              return 'md:py-3.5'
            case 'lg':
              return 'lg:py-3.5'
            case 'xl':
              return 'xl:py-3.5'
            case '2xl':
              return '2xl:py-3.5'
            default:
              return 'py-3.5'
          }
        case 't':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pt-3.5'
            case 'md':
              return 'md:pt-3.5'
            case 'lg':
              return 'lg:pt-3.5'
            case 'xl':
              return 'xl:pt-3.5'
            case '2xl':
              return '2xl:pt-3.5'
            default:
              return 'pt-3.5'
          }
        case 'b':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pb-3.5'
            case 'md':
              return 'md:pb-3.5'
            case 'lg':
              return 'lg:pb-3.5'
            case 'xl':
              return 'xl:pb-3.5'
            case '2xl':
              return '2xl:pb-3.5'
            default:
              return 'pb-3.5'
          }
        case 'l':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pl-3.5'
            case 'md':
              return 'md:pl-3.5'
            case 'lg':
              return 'lg:pl-3.5'
            case 'xl':
              return 'xl:pl-3.5'
            case '2xl':
              return '2xl:pl-3.5'
            default:
              return 'pl-3.5'
          }
        case 'r':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pr-3.5'
            case 'md':
              return 'md:pr-3.5'
            case 'lg':
              return 'lg:pr-3.5'
            case 'xl':
              return 'xl:pr-3.5'
            case '2xl':
              return '2xl:pr-3.5'
            default:
              return 'pr-3.5'
          }
        default:
          switch (breakpoint) {
            case 'sm':
              return 'sm:p-3.5'
            case 'md':
              return 'md:p-3.5'
            case 'lg':
              return 'lg:p-3.5'
            case 'xl':
              return 'xl:p-3.5'
            case '2xl':
              return '2xl:p-3.5'
            default:
              return 'p-3.5'
          }
      }
    case '4':
      switch (dimension) {
        case 'x':
          switch (breakpoint) {
            case 'sm':
              return 'sm:px-4'
            case 'md':
              return 'md:px-4'
            case 'lg':
              return 'lg:px-4'
            case 'xl':
              return 'xl:px-4'
            case '2xl':
              return '2xl:px-4'
            default:
              return 'px-4'
          }
        case 'y':
          switch (breakpoint) {
            case 'sm':
              return 'sm:py-4'
            case 'md':
              return 'md:py-4'
            case 'lg':
              return 'lg:py-4'
            case 'xl':
              return 'xl:py-4'
            case '2xl':
              return '2xl:py-4'
            default:
              return 'py-4'
          }
        case 't':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pt-4'
            case 'md':
              return 'md:pt-4'
            case 'lg':
              return 'lg:pt-4'
            case 'xl':
              return 'xl:pt-4'
            case '2xl':
              return '2xl:pt-4'
            default:
              return 'pt-4'
          }
        case 'b':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pb-4'
            case 'md':
              return 'md:pb-4'
            case 'lg':
              return 'lg:pb-4'
            case 'xl':
              return 'xl:pb-4'
            case '2xl':
              return '2xl:pb-4'
            default:
              return 'pb-4'
          }
        case 'l':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pl-4'
            case 'md':
              return 'md:pl-4'
            case 'lg':
              return 'lg:pl-4'
            case 'xl':
              return 'xl:pl-4'
            case '2xl':
              return '2xl:pl-4'
            default:
              return 'pl-4'
          }
        case 'r':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pr-4'
            case 'md':
              return 'md:pr-4'
            case 'lg':
              return 'lg:pr-4'
            case 'xl':
              return 'xl:pr-4'
            case '2xl':
              return '2xl:pr-4'
            default:
              return 'pr-4'
          }
        default:
          switch (breakpoint) {
            case 'sm':
              return 'sm:p-4'
            case 'md':
              return 'md:p-4'
            case 'lg':
              return 'lg:p-4'
            case 'xl':
              return 'xl:p-4'
            case '2xl':
              return '2xl:p-4'
            default:
              return 'p-4'
          }
      }
    case '5':
      switch (dimension) {
        case 'x':
          switch (breakpoint) {
            case 'sm':
              return 'sm:px-5'
            case 'md':
              return 'md:px-5'
            case 'lg':
              return 'lg:px-5'
            case 'xl':
              return 'xl:px-5'
            case '2xl':
              return '2xl:px-5'
            default:
              return 'px-5'
          }
        case 'y':
          switch (breakpoint) {
            case 'sm':
              return 'sm:py-5'
            case 'md':
              return 'md:py-5'
            case 'lg':
              return 'lg:py-5'
            case 'xl':
              return 'xl:py-5'
            case '2xl':
              return '2xl:py-5'
            default:
              return 'py-5'
          }
        case 't':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pt-5'
            case 'md':
              return 'md:pt-5'
            case 'lg':
              return 'lg:pt-5'
            case 'xl':
              return 'xl:pt-5'
            case '2xl':
              return '2xl:pt-5'
            default:
              return 'pt-5'
          }
        case 'b':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pb-5'
            case 'md':
              return 'md:pb-5'
            case 'lg':
              return 'lg:pb-5'
            case 'xl':
              return 'xl:pb-5'
            case '2xl':
              return '2xl:pb-5'
            default:
              return 'pb-5'
          }
        case 'l':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pl-5'
            case 'md':
              return 'md:pl-5'
            case 'lg':
              return 'lg:pl-5'
            case 'xl':
              return 'xl:pl-5'
            case '2xl':
              return '2xl:pl-5'
            default:
              return 'pl-5'
          }
        case 'r':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pr-5'
            case 'md':
              return 'md:pr-5'
            case 'lg':
              return 'lg:pr-5'
            case 'xl':
              return 'xl:pr-5'
            case '2xl':
              return '2xl:pr-5'
            default:
              return 'pr-5'
          }
        default:
          switch (breakpoint) {
            case 'sm':
              return 'sm:p-5'
            case 'md':
              return 'md:p-5'
            case 'lg':
              return 'lg:p-5'
            case 'xl':
              return 'xl:p-5'
            case '2xl':
              return '2xl:p-5'
            default:
              return 'p-5'
          }
      }
    case '6':
      switch (dimension) {
        case 'x':
          switch (breakpoint) {
            case 'sm':
              return 'sm:px-6'
            case 'md':
              return 'md:px-6'
            case 'lg':
              return 'lg:px-6'
            case 'xl':
              return 'xl:px-6'
            case '2xl':
              return '2xl:px-6'
            default:
              return 'px-6'
          }
        case 'y':
          switch (breakpoint) {
            case 'sm':
              return 'sm:py-6'
            case 'md':
              return 'md:py-6'
            case 'lg':
              return 'lg:py-6'
            case 'xl':
              return 'xl:py-6'
            case '2xl':
              return '2xl:py-6'
            default:
              return 'py-6'
          }
        case 't':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pt-6'
            case 'md':
              return 'md:pt-6'
            case 'lg':
              return 'lg:pt-6'
            case 'xl':
              return 'xl:pt-6'
            case '2xl':
              return '2xl:pt-6'
            default:
              return 'pt-6'
          }
        case 'b':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pb-6'
            case 'md':
              return 'md:pb-6'
            case 'lg':
              return 'lg:pb-6'
            case 'xl':
              return 'xl:pb-6'
            case '2xl':
              return '2xl:pb-6'
            default:
              return 'pb-6'
          }
        case 'l':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pl-6'
            case 'md':
              return 'md:pl-6'
            case 'lg':
              return 'lg:pl-6'
            case 'xl':
              return 'xl:pl-6'
            case '2xl':
              return '2xl:pl-6'
            default:
              return 'pl-6'
          }
        case 'r':
          switch (breakpoint) {
            case 'sm':
              return 'sm:pr-6'
            case 'md':
              return 'md:pr-6'
            case 'lg':
              return 'lg:pr-6'
            case 'xl':
              return 'xl:pr-6'
            case '2xl':
              return '2xl:pr-6'
            default:
              return 'pr-6'
          }
        default:
          switch (breakpoint) {
            case 'sm':
              return 'sm:p-6'
            case 'md':
              return 'md:p-6'
            case 'lg':
              return 'lg:p-6'
            case 'xl':
              return 'xl:p-6'
            case '2xl':
              return '2xl:p-6'
            default:
              return 'p-6'
          }
      }
  }
}
