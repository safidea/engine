import type { DatabaseRowType } from 'shared-database'

export type FieldType = {
  key: string
  label: string
  options?: {
    key: string
    label: string
  }[]
  type: string
}

export type SortByType = {
  field: string
  order: 'asc' | 'desc'
}

export type SortProps = {
  rows: DatabaseRowType[]
  sortBy: SortByType[]
  fields: FieldType[]
}

export type GroupByType = {
  field: string
  order: 'first_to_last' | 'last_to_first'
}

export type GroupProps = {
  rows: DatabaseRowType[]
  groupBy: GroupByType[]
  sortBy?: SortByType[]
  fields: FieldType[]
}

export type GroupType = {
  key: string
  label: string
  rows: DatabaseRowType[]
}

class ListHelper {
  sort({ rows, sortBy, fields }: SortProps): DatabaseRowType[] {
    return rows.sort((a: DatabaseRowType, b: DatabaseRowType) => {
      for (let i = 0; i < sortBy.length; i++) {
        const field = sortBy[i].field
        const order = sortBy[i].order
        let aField = a[field]
        let bField = b[field]
        const fieldType = fields.find((f) => f.key === field)?.type
        if (fieldType === 'DateTime' && aField && bField) {
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

  group({ rows, groupBy, sortBy, fields }: GroupProps): GroupType[] {
    const groups: GroupType[] = []
    for (let i = 0; i < groupBy.length; i++) {
      const field = groupBy[i].field
      const order = groupBy[i].order
      const options = [...(fields.find((f) => f.key === field)?.options || [])]
      if (order === 'last_to_first') options.reverse()
      for (let j = 0; j < options.length; j++) {
        const option = options[j]
        let groupedRows = rows.filter((row) => row[field] === option.key)
        if (sortBy && sortBy.length > 0)
          groupedRows = this.sort({
            rows: groupedRows,
            sortBy,
            fields,
          })
        groups.push({
          key: option.key,
          label: option.label,
          rows: groupedRows,
        })
      }
    }
    return groups
  }
}

export default new ListHelper()
