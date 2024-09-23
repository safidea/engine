import type { Props } from '@domain/entities/Component'
import { classNames } from '../utils'

export const Table = ({ id, className, fields, rows }: Props['Table']) => (
  <div id={id} className={classNames(className)}>
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border rounded-lg overflow-hidden dark:border-neutral-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr className="divide-x divide-gray-200 dark:divide-neutral-700">
                  {fields.map((field, index) => (
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400"
                      key={index}
                    >
                      {field.label}
                    </th>
                  ))}
                  <th
                    scope="col"
                    className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-400"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {rows.length > 0 ? (
                  rows.map((row, index) => (
                    <tr
                      className={`${index === rows.length - 1 ? '' : 'border-b'} dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-700 divide-x divide-gray-200 dark:divide-neutral-700`}
                      key={index}
                    >
                      {fields.map((field, index) => {
                        return (
                          <td
                            scope="row"
                            className={`px-6 py-4 whitespace-nowrap text-sm ${index === 0 ? 'font-medium' : ''} text-gray-800 dark:text-neutral-200`}
                            key={index}
                          >
                            {row[field.name]}
                          </td>
                        )
                      })}
                      <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                        <button
                          type="button"
                          className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="dark:border-gray-700">
                    <td
                      colSpan={fields.length + 1}
                      className="px-6 py-4 text-center text-sm font-medium text-gray-800 dark:text-neutral-200"
                    >
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
)
