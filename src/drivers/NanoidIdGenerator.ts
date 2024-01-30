import { customAlphabet } from 'nanoid'
import type { IIdGeneratorDriver } from 'src/mappers/services/idGenerator/IIdGeneratorDriver'

export class NanoidIdGenerator implements IIdGeneratorDriver {
  generate(length: number, alphabet: string) {
    return customAlphabet(alphabet, length)()
  }
}
