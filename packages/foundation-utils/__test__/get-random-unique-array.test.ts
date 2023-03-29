import { getRandomUniqueArray } from '../src'

test('get random length array', async () => {
  const array = getRandomUniqueArray({ max: 10, faker: ['name.firstName', 'phone.number'] })
  expect(array.length).toBeLessThanOrEqual(10)
  expect(array.length).toBeGreaterThanOrEqual(0)
  expect(array[0].nameFirstName).toBeDefined()
  expect(array[0].phoneNumber).toBeDefined()
  expect(
    array.findIndex((obj, i) => i > 0 && obj.nameFirstName === array[0].nameFirstName) > -1
  ).toBe(false)
  expect(array.findIndex((obj, i) => i > 0 && obj.phoneNumber === array[0].phoneNumber) > -1).toBe(
    false
  )
})
