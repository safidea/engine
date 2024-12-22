import type { IIdGeneratorDriver } from '@adapter/spi/drivers/IdGeneratorSpi'
import { customAlphabet } from 'nanoid'

export class IdGeneratorDriver implements IIdGeneratorDriver {
  generate = (length: number, alphabet: string) => {
    return customAlphabet(alphabet, length)()
  }
}
