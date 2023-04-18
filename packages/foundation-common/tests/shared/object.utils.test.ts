import { ObjectUtils } from '@shared'

test('get value from path object', () => {
  const obj = {
    a: {
      b: {
        c: 'd',
      },
    },
  }
  expect(ObjectUtils.getAtPath(obj, 'a.b.c')).toBe('d')
  expect(ObjectUtils.getAtPath(obj, 'a.b')).toEqual({ c: 'd' })
  expect(ObjectUtils.getAtPath(obj, 'a')).toEqual({ b: { c: 'd' } })
  expect(ObjectUtils.getAtPath(obj, 'a.b.c.d')).toBeUndefined()
  expect(ObjectUtils.getAtPath(obj, 'a.b.c.d.e')).toBeUndefined()
})
