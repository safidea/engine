import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'

export const Dropdown = ({ id, className = '', label, Links }: Props['Dropdown']) => {
  return (
    <div id={id} data-controller="dropdown" className={classNames('relative w-fit', className)}>
      <button
        data-action="mouseover->dropdown#show"
        className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
      >
        {label}
      </button>
      <div
        data-dropdown-target="menu"
        data-action="mouseleave->dropdown#hide"
        className="hidden absolute top-0 pt-10 min-w-full"
      >
        <div className="bg-white text-gray-800 mt-2 rounded shadow-lg p-2">
          {Links.map((Link, index) => {
            return <Link key={index} />
          })}
        </div>
      </div>
    </div>
  )
}
