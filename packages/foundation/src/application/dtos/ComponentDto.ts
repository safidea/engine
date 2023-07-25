export interface LinkDto {
  type: 'link'
  path: string
  label: string
}

export interface ParagraphDto {
  type: 'paragraph'
  text: string
}

export interface TitleDto {
  type: 'title'
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  text: string
}

export interface NavigationDto {
  type: 'navigation'
  title: TitleDto
  links: LinkDto[]
  components: ComponentDto[]
}

export interface ListDto {
  type: 'list'
  table: string
  groupBy?: {
    field: string
    order: 'asc' | 'desc' | 'first_to_last' | 'last_to_first'
  }[]
  sortBy?: {
    field: string
    order: 'asc' | 'desc' | 'first_to_last' | 'last_to_first'
  }[]
  columns: {
    label: string
    field?: string
    options?: {
      name: string
      label: string
    }[]
    format?: string
    actions?: {
      type: string
      path: string
    }[]
  }[]
}

export interface FormDto {
  type: 'form'
  table: string
  inputs: {
    field: string
    label: string
    columns?: {
      label: string
      field?: string
      placeholder?: string
    }[]
    addLabel?: string
  }[]
  submit: {
    label: string
    loadingLabel: string
    actionsOnSuccess: {
      type: string
      path: string
    }[]
  }
}

export type ComponentDto = LinkDto | ParagraphDto | NavigationDto | TitleDto | ListDto | FormDto
