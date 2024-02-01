import type { IdGeneratorDriver } from '@adapter/spi/IdGeneratorSPI'
import { customAlphabet } from 'nanoid'

export class NanoidIdGeneratorDriver implements IdGeneratorDriver {
  generate(length: number, alphabet: string) {
    return customAlphabet(alphabet, length)()
  }
}
