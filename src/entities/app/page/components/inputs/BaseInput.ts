import { AddRecord, UpdateRecord, RemoveRecord } from '../Form'
import { Record } from '@entities/drivers/database/Record'

export interface BaseInputProps {
  updateRecord: UpdateRecord
  addRecord: AddRecord
  removeRecord: RemoveRecord
  currentRecord: Record
  records: Record[]
}

export class BaseInput {
  constructor(
    private readonly _type: string,
    private readonly _field: string,
    private readonly _label?: string
  ) {}

  get type(): string {
    return this._type
  }

  get field(): string {
    return this._field
  }

  get label(): string | undefined {
    return this._label
  }
}
