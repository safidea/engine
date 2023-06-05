import type { CommonPropsType } from '../types/common.type'

export type ListProps = CommonPropsType & {
  table: string
  fields: {
    key: string
    label: string
  }[]
}

export default function List({ table, fields }: ListProps) {
  const rows = [
    {
      name: 'Facture 1',
      id: 1,
    },
    {
      name: 'Facture 2',
      id: 2,
    },
  ]
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  {fields.map((field, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rows.map((row) => (
                  <tr key={row.id}>
                    {fields.map((field, index) =>
                      index === 0 ? (
                        <td
                          key={index}
                          className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                        >
                          {row[field.key as keyof typeof row]}
                        </td>
                      ) : (
                        <td
                          key={index}
                          className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                        >
                          {row[field.key as keyof typeof row]}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
