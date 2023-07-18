export interface FieldDto {
  name: string
  type:
    | 'single_linked_record'
    | 'multiple_linked_records'
    | 'single_line_text'
    | 'long_text'
    | 'attachment'
    | 'checkbox'
    | 'multiple_select'
    | 'single_select'
    | 'date'
    | 'phone_number'
    | 'email'
    | 'url'
    | 'number'
    | 'currency'
    | 'percent'
    | 'duration'
    | 'rating'
    | 'formula'
    | 'rollup'
    | 'count'
    | 'lookup'
    | 'created_time'
    | 'last_modified_time'
    | 'deleted_time'
  optional?: boolean
}
