import type { Props } from '@infrastructure/engine'

export const Table = ({ title, columns, rows, AddButton }: Props['Table']) => (
  <section className="dark:bg-gray-800 relative overflow-hidden">
    {AddButton || title ? (
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
        {title && <div className="w-full md:w-1/2">{title}</div>}
        {AddButton && (
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
            {AddButton}
          </div>
        )}
      </div>
    ) : null}
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map((column, index) => (
              <th scope="col" className="px-4 py-3" key={index}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr className="border-b dark:border-gray-700" key={index}>
              {columns.map((column, index) => {
                if (index === 0) {
                  return (
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      key={index}
                    >
                      {row[column.name]}
                    </th>
                  )
                } else {
                  return (
                    <td className="px-4 py-3" key={index}>
                      {row[column.name]}
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
