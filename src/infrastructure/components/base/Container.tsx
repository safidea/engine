import type { Props } from '@domain/engine/page/component'
import { classNames, getTextAlignClasses } from '../utils'
import type { Size, SizeWithNone } from '@domain/engine/page/component/base/base'

export const Container = ({
  id,
  className = '',
  align = 'left',
  spacing = 'lg',
  width = 'xl',
  children,
}: Props['Container']) => (
  <section id={id} className={classNames('bg-white dark:bg-gray-900', className)}>
    <div
      className={classNames(
        getWithClasses(width),
        getSpacingClasses(spacing),
        getTextAlignClasses(align)
      )}
    >
      {children}
    </div>
  </section>
)

function getWithClasses(width: Size) {
  switch (width) {
    case 'xs':
      return 'w-full'
    case 'sm':
      return 'mx-auto max-w-screen-sm'
    case 'md':
      return 'mx-auto max-w-screen-md'
    case 'lg':
      return 'mx-auto max-w-screen-lg'
    case 'xl':
      return 'mx-auto max-w-screen-xl'
    case '2xl':
      return 'mx-auto max-w-screen-2xl'
  }
}

function getSpacingClasses(spacing: SizeWithNone) {
  switch (spacing) {
    case 'none':
      return 'py-0 px-0'
    case 'xs':
      return 'py-2 px-1 lg:py-4 lg:px-2'
    case 'sm':
      return 'py-4 px-2 lg:py-8 lg:px-6'
    case 'md':
      return 'py-6 px-3 lg:py-12 lg:px-8'
    case 'lg':
      return 'py-8 px-4 lg:py-16 lg:px-12'
    case 'xl':
      return 'py-10 px-5 lg:py-20 lg:px-14'
    case '2xl':
      return 'py-12 px-6 lg:py-24 lg:px-16'
  }
}
