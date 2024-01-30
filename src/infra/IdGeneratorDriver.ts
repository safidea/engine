import { customAlphabet } from 'nanoid'
import type { IIdGeneratorDriver } from 'src_OLD/services/idGenerator/IIdGeneratorDriver'

export class IdGeneratorDriver implements IIdGeneratorDriver {
  generate(length: number, alphabet: string) {
    return customAlphabet(alphabet, length)()
  }
}
