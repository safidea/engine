import { ObjectUtils } from '../../src'

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

describe('replaceVars', () => {
  it('should replace vars in object', () => {
    const obj = {
      a: '${b}',
      c: {
        d: '${e}',
      },
      f: 1,
    }
    const vars = {
      b: 'f',
      e: 'g',
    }
    expect(ObjectUtils.replaceVars(obj, vars)).toEqual({
      a: 'f',
      c: {
        d: 'g',
      },
      f: 1,
    })
  })

  it('should replace vars in object with nested vars', () => {
    const obj = {
      a: '${b}',
      c: {
        d: '${e}',
      },
    }
    const vars = {
      b: '${f}',
      e: 'g',
      f: 'h',
    }
    expect(ObjectUtils.replaceVars(obj, vars)).toEqual({
      a: 'h',
      c: {
        d: 'g',
      },
    })
  })
})

describe('replaceVarsInString', () => {
  it('should replace vars in string', () => {
    const str = '${a} ${b}'
    const vars = {
      a: 'c',
      b: 'd',
    }
    expect(ObjectUtils.replaceVarsInString(str, vars)).toBe('c d')
  })

  it('should replace vars in string with nested vars', () => {
    const str = '${a} ${b}'
    const vars = {
      a: '${c}',
      b: 'd',
      c: 'e',
    }
    expect(ObjectUtils.replaceVarsInString(str, vars)).toBe('e d')
  })
})
