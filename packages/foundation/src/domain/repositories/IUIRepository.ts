import { Record } from '@domain/entities/Record'
import { Column } from '@domain/entities/components/List'

export interface UIProps {
  children: string | JSX.Element | JSX.Element[]
}

export interface LinkUIProps extends UIProps {
  href: string
}

export interface ListUIHeaderProps {
  columns: Column[]
}

export interface ListUIRowProps {
  columns: Column[]
  record: Record
}

export interface IUIRepository {
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
    content: React.FC<UIProps>
  }
  ListUI: {
    container: React.FC<UIProps>
    header: React.FC<ListUIHeaderProps>
    rows: React.FC<UIProps>
    row: React.FC<ListUIRowProps>
    error: React.FC
    loading: React.FC
  }
}
