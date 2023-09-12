export interface UpdateRecordActionOptions {
  name: string
  type: 'update_record'
  table: string
  recordId: string
  fields: { [key: string]: string }
}
