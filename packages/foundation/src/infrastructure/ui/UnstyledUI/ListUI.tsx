import { ListUIHeaderColumnProps, ListUIRowColumnProps, UIProps } from '@domain/gateways/IUIGateway'

const ListUI = {
  container: ({ children }: UIProps) => {
    return <table>{children}</table>
  },
  header: ({ children }: UIProps) => {
    return (
      <thead>
        <tr>{children}</tr>
      </thead>
    )
  },
  headerColumn: ({ label }: ListUIHeaderColumnProps) => {
    return <th>{label}</th>
  },
  rows: ({ children }: UIProps) => {
    return <tbody>{children}</tbody>
  },
  row: ({ children }: UIProps) => {
    return <tr>{children}</tr>
  },
  rowColumn: ({ value }: ListUIRowColumnProps) => {
    return <td>{value}</td>
  },
  error: () => {
    return <div>failed to load</div>
  },
  loading: () => {
    return <div>loading</div>
  },
}

export default ListUI
