export interface DataDto {
  [key: string]: string | string[] | number | boolean | DataDto | DataDto[] | undefined
}
