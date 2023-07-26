import { ListUIHeaderProps, ListUIRowProps, UIProps } from '@domain/repositories/IUIRepository'

const ListUI = {
  container: ({ children, ...props }: UIProps) => {
    return <div {...props}>{children}</div>
  },
  header: ({ ...props }: ListUIHeaderProps) => {
    return <div {...props}>header</div>
  },
  rows: ({ children, ...props }: UIProps) => {
    return <div {...props}>{children}</div>
  },
  row: ({ ...props }: ListUIRowProps) => {
    return <div {...props}>row</div>
  },
  error: () => {
    return <div>error</div>
  },
  loading: () => {
    return <div>loading</div>
  },
}

export default ListUI
