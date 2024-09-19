import type { Props } from '@domain/entities/Component'
import { classNames } from '../utils'

export const Columns = ({ id, className = '', columns, Components }: Props['Columns']) => {
  const classes = []
  classes.push('columns-' + columns)
  return (
    <div id={id} className={classNames(...classes, className)}>
      {Components.map((Component, index) => (
        <Component key={index} className="w-full" />
      ))}
    </div>
  )
}
