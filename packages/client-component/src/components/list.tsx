import useSWR from 'swr'
import { Fragment } from 'react'
import ListHelper from '../helpers/list.helper'

import type { CommonProps } from 'shared-component'
import type { DatabaseRowType } from 'shared-database'
import type { SortByType, GroupByType, GroupType, FieldType } from '../helpers/list.helper'

export type ListProps = CommonProps & {
  table: string
  fields: FieldType[]
  sortBy?: SortByType[]
  groupBy?: GroupByType[]
}

export function Header({ fields }: { fields: FieldType[] }) {
  return (
    <tr>
      {fields.map((field, index) => (
        <th
          key={index}
          scope="col"
          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
        >
          {field.label}
        </th>
      ))}
    </tr>
  )
}

export function Row({ row, fields }: { row: DatabaseRowType; fields: FieldType[] }) {
  return (
    <tr id={String(row.id)}>
      {fields.map((field, index) => {
        let value = row[field.key as keyof typeof row]
        if (field.options) {
          value = field.options.find((option) => option.key === value)?.label ?? value
        }
        return index === 0 ? (
          <td
            key={index}
            data-field={field.key}
            className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3"
          >
            {value}
          </td>
        ) : (
          <td
            key={index}
            data-field={field.key}
            className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
          >
            {value}
          </td>
        )
      })}
    </tr>
  )
}

export function Group({ group, fields }: { group: GroupType; fields: ListProps['fields'] }) {
  return (
    <Fragment>
      <tr className="border-t border-gray-200">
        <th
          colSpan={fields.length}
          scope="colgroup"
          className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
        >
          {group.label}
        </th>
      </tr>
      {group.rows.map((row) => (
        <Row key={row.id} row={row} fields={fields} />
      ))}
    </Fragment>
  )
}

export default function List({ table, fields, sortBy, groupBy }: ListProps) {
  const { data, error, isLoading } = useSWR(`/api/table/${table}`, { refreshInterval: 0 })
  let rows = (data ?? []) as DatabaseRowType[]
  let groups: GroupType[] = []

  if (error) return <div>failed to load</div>

  if (isLoading) return <div>loading...</div>

  if (groupBy && groupBy.length > 0) {
    groups = ListHelper.group({ rows, groupBy, sortBy, fields })
  } else if (sortBy && sortBy.length > 0) {
    rows = ListHelper.sort({ rows, sortBy, fields })
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full pt-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <Header fields={fields} />
              </thead>
              <tbody className="divide-y divide-gray-200">
                {groups.length > 0
                  ? groups.map((group) => <Group key={group.key} group={group} fields={fields} />)
                  : rows.map((row) => <Row key={row.id} row={row} fields={fields} />)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
