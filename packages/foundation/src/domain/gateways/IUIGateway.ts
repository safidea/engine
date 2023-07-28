export interface UIProps {
  children: string | JSX.Element | JSX.Element[]
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

export interface ListUIRowColumnProps {
  value: string
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
    row: React.FC<UIProps>
    rowColumn: React.FC<ListUIRowColumnProps>
    error: React.FC
    loading: React.FC
  }
}
