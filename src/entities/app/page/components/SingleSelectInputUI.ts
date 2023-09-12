export interface SingleSelectInputUIOptionProps {
  label: string
  value: string
}

export interface SingleSelectInputUILabelProps {
  label: string
  htmlFor: string
}

export interface SingleSelectInputUISelectProps {
  name: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  id: string
  children: React.ReactNode
  value: string
}

export interface SingleSelectInputUI {
  label: React.FC<SingleSelectInputUILabelProps>
  select: React.FC<SingleSelectInputUISelectProps>
  option: React.FC<SingleSelectInputUIOptionProps>
}
