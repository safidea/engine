import type { Props } from '@domain/entities/Component'
import { center, classNames, padding } from '../utils'

export const Container = ({
  id,
  className,
  breakpoint,
  center: isCentered,
  padding: paddingSize,
  children,
}: Props['Container']) => {
  const classes = []
  if (breakpoint === 'none') classes.push('w-full')
  else if (breakpoint) classes.push(breakpoint + ':container')
  else classes.push('container')
  if (isCentered === true) classes.push(center({ breakpoint, dimension: 'x' }))
  if (paddingSize) classes.push(padding({ size: paddingSize, dimension: 'x', breakpoint }))
  return (
    <div id={id} className={classNames(...classes, className)}>
      {children}
    </div>
  )
}
