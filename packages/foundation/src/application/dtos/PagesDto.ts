export interface PagesDto {
  [key: string]: PageDto
}

export interface PageDto {
  components: ComponentDto[]
}

export interface ComponentDto {
  key: string
  text: string
}
