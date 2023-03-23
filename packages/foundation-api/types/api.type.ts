import { InOutput } from './inoutput.api.type'
import { Action } from './action.api.type'
import { ActionInOutput } from './inoutput.action.api.type'
import { Test } from './test.api.type'
import { TestTable } from './table.test.api.type'

export type Api = {
  name: string
  input: InOutput[]
  actions: Action[]
  output: InOutput[]
  tests?: Test[]
}

export type { InOutput, Action, Test, TestTable, ActionInOutput }
