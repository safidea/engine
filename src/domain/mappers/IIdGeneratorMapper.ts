export interface IIdGeneratorMapper {
  generate: (length: number, chars: string) => string
}
