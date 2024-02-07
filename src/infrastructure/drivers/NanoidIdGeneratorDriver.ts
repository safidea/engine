import type { Driver } from '@adapter/spi/IdGeneratorSpi'
import { customAlphabet } from 'nanoid'

export class NanoidIdGeneratorDriver implements Driver {
  generate = (length: number, alphabet: string) => {
    return customAlphabet(alphabet, length)()
  }
}
