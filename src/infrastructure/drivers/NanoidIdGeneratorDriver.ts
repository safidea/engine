import type { IdGeneratorDriver } from '@adapter/spi/IdGeneratorSpi'
import { customAlphabet } from 'nanoid'

export class NanoidIdGeneratorDriver implements IdGeneratorDriver {
  generate(length: number, alphabet: string) {
    return customAlphabet(alphabet, length)()
  }
}
