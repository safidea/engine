import { faker as fake } from '@faker-js/faker'
import capitalize from './capitalize'

export type RandomUniqueObject = { [key: string]: string | number | boolean }

export default function getRandomUniqueArray(options?: {
  max?: number
  faker?: string[]
}): RandomUniqueObject[] {
  const { max = 10, faker = [] } = options ?? {}
  const length = Math.floor(Math.random() * (max - 1)) + 1
  const emptyArray = Array.from({ length })

  return emptyArray.reduce((array: RandomUniqueObject[]) => {
    const unique: RandomUniqueObject = faker.reduce((acc: RandomUniqueObject, path: string) => {
      const [category, type] = path.split('.')

      if (!category || !fake.hasOwnProperty(category))
        throw new Error(`Invalid faker category "${category}"`)
      const fakerCategory = fake[category as keyof typeof fake]

      if (!type || !fakerCategory.hasOwnProperty(type))
        throw new Error(`Invalid faker type "${type}" for category "${category}"`)

      const fakerCategoryType = fakerCategory[type as keyof typeof fakerCategory] as () =>
        | string
        | number
        | boolean
      const key = category + capitalize(type)
      let value: string | number | boolean
      let exist = true

      do {
        value = fakerCategoryType()
        exist = array.findIndex((obj) => obj[key] === value) > -1
      } while (exist === true)

      acc[key as keyof typeof acc] = value
      return acc
    }, {})

    array.push(unique)
    return array
  }, [])
}
