import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'

export const Columns = ({ id, className = '', columnsNumber, Components }: Props['Columns']) => (
  <div
    id={id}
    className={classNames(getColumnsClasses(columnsNumber), className)}
    data-component="Columns"
  >
    {Components.map((Component, index) => (
      <Component key={index} className="w-full" />
    ))}
  </div>
)

function getColumnsClasses(columnsNumber: number) {
  switch (columnsNumber) {
    case 1:
      return 'columns-1'
    case 2:
      return 'columns-2'
    case 3:
      return 'columns-3'
    case 4:
      return 'columns-4'
    case 5:
      return 'columns-5'
    case 6:
      return 'columns-6'
    case 7:
      return 'columns-7'
    case 8:
      return 'columns-8'
    case 9:
      return 'columns-9'
    case 10:
      return 'columns-10'
    case 11:
      return 'columns-11'
    case 12:
      return 'columns-12'
    default:
      return 'columns-auto'
  }
}
