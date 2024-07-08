import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'

export const Container = ({
  id,
  className = '',
  breakpoint,
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
      break
    case 'md':
      classes += 'md:container'
      break
    case 'lg':
      classes += 'lg:container'
      break
    case 'xl':
      classes += 'xl:container'
      break
    case '2xl':
      classes += '2xl:container'
      break
    default:
      classes += 'container'
      break
  }
  return (
    <div id={id} className={classNames(classes, className)} data-component={dataComponent}>
      {children}
    </div>
  )
}
