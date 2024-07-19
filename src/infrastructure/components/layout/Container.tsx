import type { Props } from '@domain/entities/Component'
import { center, classNames, padding } from '../utils'

export const Container = ({
  id,
  className,
  breakpoint,
  center: isCentered,
  padding: paddingSize,
  children,
  ['data-component']: dataComponent = 'Container',
}: Props['Container']) => {
  const classes = []
  switch (breakpoint) {
    case 'none':
      classes.push('w-full')
      break
    case 'sm':
      classes.push('sm:container')
      break
    case 'md':
      classes.push('md:container')
      break
    case 'lg':
      classes.push('lg:container')
      break
    case 'xl':
      classes.push('xl:container')
      break
    case '2xl':
      classes.push('2xl:container')
      break
    default:
      classes.push('container')
      break
  }
  if (isCentered === true) classes.push(center({ breakpoint, dimension: 'x' }))
  if (paddingSize) classes.push(padding({ size: paddingSize, dimension: 'x', breakpoint }))
  return (
    <div id={id} className={classNames(...classes, className)} data-component={dataComponent}>
      {children}
    </div>
  )
}
