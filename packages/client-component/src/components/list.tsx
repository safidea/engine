'use client'

import useSWR from 'swr'
import fetcher from '../libraries/fetcher.library'

import type { CommonPropsType } from '../types/common.type'
import type { DatabaseRowType } from 'shared-database'

export type ListProps = CommonPropsType & {
  table: string
  fields: {
    key: string
    label: string
    options?: {
      key: string
      label: string
    }[]
  }[]
  sortBy?: {
    field: string
    order: 'asc' | 'desc'
  }[]
  groupBy?: {
    field: string
    order: 'first_to_last' | 'last_to_first'
  }[]
}

export default function List({ table, fields, sortBy, config }: ListProps) {
  const { data = [], error, isLoading } = useSWR(`/api/table/${table}`, fetcher)

  if (error) return <div>failed to load</div>

  if (isLoading) return <div>loading...</div>

  if (sortBy && sortBy.length > 0 && config.tables && config.tables[table]) {
    const configFields = config.tables[table].fields
    data.sort((a: DatabaseRowType, b: DatabaseRowType) => {
      for (let i = 0; i < sortBy.length; i++) {
        const field = sortBy[i].field
        const order = sortBy[i].order
        let aField = a[field]
        let bField = b[field]
        if (configFields[field] && configFields[field].type === 'DateTime' && aField && bField) {
          aField = Date.parse(String(aField))
          bField = Date.parse(String(bField))
        }
        if (aField > bField) {
          return order === 'desc' ? -1 : 1
        } else if (aField < bField) {
          return order === 'desc' ? 1 : -1
        }
      }
      return 0
    })
  }

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
                {data.map((row: DatabaseRowType) => (
                  <tr key={row.id}>
                    {fields.map((field, index) => {
                      let value = row[field.key as keyof typeof row]
                      if (field.options) {
                        value = field.options.find((option) => option.key === value)?.label ?? value
                      }
                      return index === 0 ? (
                        <td
                          key={index}
                          className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                        >
                          {value}
                        </td>
                      ) : (
                        <td
                          key={index}
                          className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                        >
                          {value}
                        </td>
                      )
                    })}
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
