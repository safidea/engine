type Base = {
  field: string
}

type Equal = Base & {
  operator: '='
  value: string | number
}

type In = Base & {
  operator: 'in'
  value: string[]
}

export type FilterDto = Equal | In
