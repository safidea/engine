import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'

export const Container = ({
  id,
  className,
  breakpoint,
  center,
  children,
  ['data-component']: dataComponent = 'Container',
}: Props['Container']) => {
  let classes = ''
  switch (breakpoint) {
    case 'none':
      classes += 'w-full'
      break
    case 'sm':
      classes += 'sm:container'
      if (center === true) classes += ' sm:mx-auto'
      break
    case 'md':
      classes += 'md:container'
      if (center === true) classes += ' md:mx-auto'
      break
    case 'lg':
      classes += 'lg:container'
      if (center === true) classes += ' lg:mx-auto'
      break
    case 'xl':
      classes += 'xl:container'
      if (center === true) classes += ' xl:mx-auto'
      break
    case '2xl':
      classes += '2xl:container'
      if (center === true) classes += ' 2xl:mx-auto'
      break
    default:
      classes += 'container'
      if (center === true) classes += ' mx-auto'
      break
  }
  return (
    <div id={id} className={classNames(classes, className)} data-component={dataComponent}>
      {children}
    </div>
  )
}
