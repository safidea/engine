import type { Props } from '@domain/entities/Component'
import { classNames } from '../utils'

export const Table = ({ id, className = '', fields, rows }: Props['Table']) => (
  <section id={id} className={classNames('dark:bg-gray-800 relative overflow-hidden', className)}>
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {fields.map((field, index) => (
              <th scope="col" className="px-4 py-3" key={index}>
                {field.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr className="border-b dark:border-gray-700" key={index}>
              {fields.map((field, index) => {
                if (index === 0) {
                  return (
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      key={index}
                    >
                      {row[field.name]}
                    </th>
                  )
                } else {
                  return (
                    <td className="px-4 py-3" key={index}>
                      {row[field.name]}
                    </td>
                  )
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)
