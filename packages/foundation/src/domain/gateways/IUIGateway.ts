export interface UIProps {
  children: string | JSX.Element | (string | JSX.Element | JSX.Element | undefined)[]
}

export interface LinkUIProps extends UIProps {
  href: string
}

export interface ListUIHeaderColumnProps {
  label: string
}

export interface ListUIGroupProps {
  label: string
  colSpan: number
}

export interface ListUIRowProps extends UIProps {
  id: string
}

export interface ListUITextCellProps {
  value: string
}

export interface ListUIButtonCellProps {
  label: string
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export interface ListUILinkCellProps {
  label: string
}

export interface FormUIFormProps extends UIProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export interface FormUISubmitProps {
  label: string
}

export interface FormUIErrorMessageProps {
  message: string
}

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

export interface TableInputUILabelProps {
  label: string
}

export interface TableInputUIAddButtonProps {
  label: string
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export interface TableInputUIHeaderColumnProps {
  label: string
}

export interface TableInputUIRowColumnProps {
  name: string
  placeholder?: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export interface IUIGateway {
  LinkUI: React.FC<LinkUIProps>
  ParagraphUI: React.FC<UIProps>
  TitleUI: {
    xs: React.FC<UIProps>
    sm: React.FC<UIProps>
    md: React.FC<UIProps>
    lg: React.FC<UIProps>
    xl: React.FC<UIProps>
  }
  NavigationUI: {
    container: React.FC<UIProps>
    sidebar: React.FC<UIProps>
    links: React.FC<UIProps>
    link: React.FC<UIProps>
    content: React.FC<UIProps>
  }
  ListUI: {
    container: React.FC<UIProps>
    header: React.FC<UIProps>
    headerColumn: React.FC<ListUIHeaderColumnProps>
    group: React.FC<ListUIGroupProps>
    rows: React.FC<UIProps>
    row: React.FC<ListUIRowProps>
    cell: React.FC<UIProps>
    textCell: React.FC<ListUITextCellProps>
    buttonCell: React.FC<ListUIButtonCellProps>
    linkCell: React.FC<ListUILinkCellProps>
  }
  FormUI: {
    form: React.FC<FormUIFormProps>
    input: React.FC<UIProps>
    inputs: React.FC<UIProps>
    submit: React.FC<FormUISubmitProps>
    errorMessage: React.FC<FormUIErrorMessageProps>
  }
  TextInputUI: {
    label: React.FC<InputTextUILabelProps>
    input: React.FC<InputTextUIInputProps>
  }
  TableInputUI: {
    container: React.FC<UIProps>
    menu: React.FC<UIProps>
    label: React.FC<TableInputUILabelProps>
    addButton: React.FC<TableInputUIAddButtonProps>
    table: React.FC<UIProps>
    header: React.FC<UIProps>
    headerColumn: React.FC<TableInputUIHeaderColumnProps>
    rows: React.FC<UIProps>
    row: React.FC<UIProps>
    rowColumn: React.FC<TableInputUIRowColumnProps>
  }
}
