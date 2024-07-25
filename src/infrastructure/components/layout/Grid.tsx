import type { Props } from '@domain/entities/Component'
import { classNames } from '../utils'

export const Grid = ({ id, className = '', columns, Components }: Props['Grid']) => {
  const classes = ['grid']
  classes.push('grid-cols-' + columns)
  return (
    <div id={id} className={classNames(...classes, 'gap-4', className)} data-component="Grid">
      {Components.map((Component, index) => (
        <Component key={index} />
      ))}
    </div>
  )
}
