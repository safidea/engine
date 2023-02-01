import { faker } from '@faker-js/faker'
import getRandomLengthArray from './get-random-length-array'

export default function getRandomKeyValue(options?: { max?: number; value?: unknown }): {
  [key: string]: unknown
} {
  return getRandomLengthArray(options?.max).reduce((acc: { [key: string]: unknown }) => {
    acc[faker.random.word() as keyof typeof acc] = options?.value ?? faker.random.word()
    return acc
  }, {})
}
