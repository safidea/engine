type Base = {
  column: string
}

type Equal = Base & {
  operator: '='
  value: string
}

type In = Base & {
  operator: 'in'
  value: string[]
}

export type DatabaseFilterDto = Equal | In
