import { faker as fake } from '@faker-js/faker'
import capitalize from './capitalize'

export type RandomUniqueObject = { [key: string]: string | number | boolean }

export default function getRandomUniqueArray(options?: {
  min?: number
  max?: number
  faker?: string[]
}): RandomUniqueObject[] {
  const { min = 1, max = 5, faker = [] } = options ?? {}
  const length = fake.datatype.number({ min, max })
  const emptyArray = Array.from({ length })

  if (faker.length === 0) return emptyArray.map(() => ({}))

  const uniqueArraysByPath = faker.reduce(
    (acc: { [key: string]: (string | number | boolean)[] }, path: string) => {
      const [category, type] = path.split('.')

      if (!category || !fake.hasOwnProperty(category))
        throw new Error(`Invalid faker category "${category}"`)
      const fakerCategory = fake[category as keyof typeof fake]

      if (!type || !fakerCategory.hasOwnProperty(type))
        throw new Error(`Invalid faker type "${type}" for category "${category}"`)

      let array: (string | number | boolean)[] = fake.helpers.uniqueArray(
        fakerCategory[type as keyof typeof fakerCategory],
        length
      )

      switch (path) {
        case 'word.noun':
          array = array.map((word) => word.toString().replace(/-/g, ''))
          break
        default:
          break
      }

      acc[path] = array
      return acc
    },
    {}
  )

  return emptyArray.map((_, index) => {
    return Object.keys(uniqueArraysByPath).reduce((acc: RandomUniqueObject, path: string) => {
      const [category, type] = path.split('.')
      const key = category + capitalize(type)
      acc[key as keyof typeof acc] = uniqueArraysByPath[path][index]
      return acc
    }, {})
  })
}
