import { ObjectUtils } from '@common'

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

test('set value from path object', () => {
  const obj = {
    a: {
      b: {
        c: 'd',
      },
    },
  }
  ObjectUtils.setAtPath(obj, 'a.b.c', 'e')
  expect(obj).toEqual({
    a: {
      b: {
        c: 'e',
      },
    },
  })
  ObjectUtils.setAtPath(obj, 'a.b.c.d', 'f')
  expect(obj).toEqual({
    a: {
      b: {
        c: {
          d: 'f',
        },
      },
    },
  })
  ObjectUtils.setAtPath(obj, 'a.b.c.d.e', 'g')
  expect(obj).toEqual({
    a: {
      b: {
        c: {
          d: {
            e: 'g',
          },
        },
      },
    },
  })
})

test('check if object is empty', () => {
  expect(ObjectUtils.isEmpty({})).toBe(true)
  expect(ObjectUtils.isEmpty({ a: 1 })).toBe(false)
})
