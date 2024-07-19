import type { Props } from '@domain/entities/Component'
import { classNames } from '../utils'

export const Grid = ({ id, className = '', columns, Components }: Props['Grid']) => (
  <div
    id={id}
    className={classNames('grid', getColumnsClasses(columns), 'gap-4', className)}
    data-component="Grid"
  >
    {Components.map((Component, index) => (
      <Component key={index} />
    ))}
  </div>
)

function getColumnsClasses(columns: number) {
  switch (columns) {
    case 1:
      return 'grid-cols-1'
    case 2:
      return 'grid-cols-2'
    case 3:
      return 'grid-cols-3'
    case 4:
      return 'grid-cols-4'
    case 5:
      return 'grid-cols-5'
    case 6:
      return 'grid-cols-6'
    case 7:
      return 'grid-cols-7'
    case 8:
      return 'grid-cols-8'
    case 9:
      return 'grid-cols-9'
    case 10:
      return 'grid-cols-10'
    case 11:
      return 'grid-cols-11'
    case 12:
      return 'grid-cols-12'
    default:
      return 'grid-cols-none'
  }
}
