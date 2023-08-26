export interface SingleSelectRecordInputUIOptionProps {
  label: string
  value: string
}

export interface SingleSelectRecordInputUILabelProps {
  label: string
  htmlFor: string
}

export interface SingleSelectRecordInputUISelectProps {
  name: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  id: string
  children: React.ReactNode
  value: string
}

export interface SingleSelectRecordInputUI {
  label: React.FC<SingleSelectRecordInputUILabelProps>
  select: React.FC<SingleSelectRecordInputUISelectProps>
  option: React.FC<SingleSelectRecordInputUIOptionProps>
}
