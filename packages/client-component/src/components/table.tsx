import useSWR from 'swr'
import { useState } from 'react'

import type { CommonProps } from 'shared-component'

export type RowsProps = TableProps & {
  data?: { [key: string]: string }[]
}

export type TableProps = CommonProps & {
  table: string
  fields: {
    key: string
    type: string
    label?: string
    placeholder?: string
  }[]
  label?: string
  addLabel?: string
  submit: {
    type: 'create' | 'update' | 'upsert'
  }
  onDataChange: (data: { [key: string]: string }[]) => void
  rowsIds: string[]
}

function Rows({ data = [], fields, label, addLabel, onDataChange }: RowsProps) {
  const [tableData, setTableData] = useState(data)

  const addRow = () => {
    const newRow = fields.reduce(
      (acc, field) => {
        acc[field.key] = ''
        return acc
      },
      {} as Record<string, string>
    )
    setTableData([...tableData, newRow])
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target
    const newData = [...tableData]
    newData[index][name] = value
    setTableData(newData)
    onDataChange(newData)
  }

  return (
    <div>
      {label && addLabel && (
        <div className="sm:flex sm:items-center">
          {label && (
            <div className="sm:flex-auto">
              <p className="text-base font-semibold leading-6 text-gray-900">{label}</p>
            </div>
          )}
          {addLabel && (
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                onClick={addRow}
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {addLabel}
              </button>
            </div>
          )}
        </div>
      )}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flow-root">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full pt-2 align-middle">
              <table className="min-w-full divide-y divide-gray-300 border">
                <thead>
                  <tr className="divide-x divide-gray-200">
                    {fields.map((field, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="px-2 py-1.5 text-left text-sm font-semibold text-gray-900"
                      >
                        {field.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {tableData.map((row, indexRow) => (
                    <tr key={row.id ?? indexRow} className="divide-x divide-gray-200">
                      {fields.map((field, indexCell) => (
                        <td key={indexCell}>
                          <input
                            type={field.type}
                            name={field.key}
                            onChange={(e) => handleChange(e, indexRow)}
                            placeholder={field.placeholder}
                            value={row[field.key] ?? ''}
                            className="px-2 py-1.5 border-0 text-sm text-gray-900 placeholder:text-gray-400 w-full"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Create(props: TableProps) {
  return <Rows {...props} />
}

function Update({ table, rowsIds, ...props }: TableProps) {
  const ids = rowsIds.join(',')
  let url = `/api/table/${table}`
  if (ids.length > 0) url += `?filter_key_0=id&filter_operator_0=is_any_of&filter_value_0=${ids}`
  const { data = [], error, isLoading } = useSWR(url)
  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  if (data.error) throw new Error(data.error)
  return <Rows data={data} {...props} table={table} rowsIds={rowsIds} />
}

export default function Table({ submit, ...props }: TableProps) {
  if (submit.type === 'create') {
    return <Create {...props} submit={submit} />
  }
  return <Update {...props} submit={submit} />
}
