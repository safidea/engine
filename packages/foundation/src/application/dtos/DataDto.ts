export interface DataDto {
  [key: string]: string | number | boolean | DataDto | DataDto[] | undefined
}
