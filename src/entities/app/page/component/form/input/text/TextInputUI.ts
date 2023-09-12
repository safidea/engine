export interface InputTextUILabelProps {
  label: string
  htmlFor: string
}

export interface InputTextUIInputProps {
  name: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  id: string
  value: string
}

export interface TextInputUI {
  label: React.FC<InputTextUILabelProps>
  input: React.FC<InputTextUIInputProps>
}
