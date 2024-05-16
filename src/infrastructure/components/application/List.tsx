import type { Props } from '@domain/engine/page/component'
import { classNames } from '../utils'

export const List = ({ id, className = '', columns, rows, actionClientProps }: Props['List']) => (
  <section id={id} className={classNames('dark:bg-gray-800 relative overflow-hidden', className)}>
    <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      {rows.map((row, index) => (
        <a
          className="border-b dark:border-gray-700 flex hover:bg-gray-50"
          key={index}
          href={row.open}
          {...actionClientProps}
        >
          {columns.map((column, index) => {
            if (index === 0) {
              return (
                <div
                  className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  key={index}
                >
                  {row.data[column.name]}
                </div>
              )
            } else {
              return (
                <div className="px-4 py-3" key={index}>
                  {row.data[column.name]}
                </div>
              )
            }
          })}
        </a>
      ))}
    </div>
  </section>
)
