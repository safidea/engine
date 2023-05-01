import { ObjectUtils } from '@common'

describe('isEmpty', () => {
  it('should check an empty object', () => {
    expect(ObjectUtils.isEmpty({})).toBe(true)
  })

  it('should check a non-empty object', () => {
    expect(ObjectUtils.isEmpty({ test: true })).toBe(false)
  })
})

describe('getAtPath', () => {
  it('get value from path object', () => {
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
})

describe('setAtPath', () => {
  it('set value from path object', () => {
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
})
