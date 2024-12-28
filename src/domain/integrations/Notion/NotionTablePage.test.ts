import { beforeEach, it, describe, expect } from 'bun:test'
import { NotionTablePage } from './NotionTablePage'

let notionTablePage: NotionTablePage

beforeEach(() => {
  const mockProperties = {
    title: 'Test Title',
    checkbox: true,
    createdBy: 'Creator',
    createdTime: new Date('2023-01-01T00:00:00Z'),
    email: 'test@example.com',
    files: [
      { name: 'file1', url: 'https://example.com/file1' },
      { name: 'file2', url: 'https://example.com/file2' },
    ],
    number: 42,
    multiSelect: ['option1', 'option2'],
    people: ['Person A', 'Person B'],
    phone: '123-456-7890',
    relations: ['relation1', 'relation2'],
    stringFormula: 'Formula String',
    numberFormula: 100,
    booleanFormula: false,
    dateFormula: new Date('2023-02-01T00:00:00Z'),
    lastEditedBy: 'Editor',
    lastEditedTime: new Date('2023-01-03T00:00:00Z'),
    stringArrayRollup: ['string1', 'string2', 'string3'],
    numberArrayRollup: [1, 2, 3],
    booleanArrayRollup: [true, false, true],
    numberRollup: 1,
    dateRollup: new Date('2023-02-01T00:00:00Z'),
    status: 'In Progress',
    url: 'https://example.com',
  }

  notionTablePage = new NotionTablePage(
    'page-id',
    mockProperties,
    new Date('2023-01-01T00:00:00Z'),
    new Date('2023-01-02T00:00:00Z'),
    false
  )
})

describe('id', () => {
  it('should return id without -', () => {
    const id = notionTablePage.id
    expect(id).toBe('pageid')
  })
})

describe('getTitle', () => {
  it('should return title as a string', () => {
    const title = notionTablePage.getTitle('title')
    expect(title).toBe('Test Title')
  })

  it('should throw an error for non-existing property', () => {
    expect(() => notionTablePage.getTitle('nonExisting')).toThrowError(
      'Property "nonExisting" does not exist'
    )
  })
})

describe('getCheckbox', () => {
  it('should return checkbox as a boolean', () => {
    const checkbox = notionTablePage.getCheckbox('checkbox')
    expect(checkbox).toBe(true)
  })
})

describe('getCreatedBy', () => {
  it('should return createdBy as a string and not null', () => {
    const createdBy = notionTablePage.getCreatedBy('createdBy')
    expect(createdBy).toBe('Creator')
  })

  it('should throw an error if createdBy is null', () => {
    notionTablePage.properties.createdBy = null
    expect(() => notionTablePage.getCreatedBy('createdBy')).toThrowError(
      'Property "createdBy" should not be null'
    )
  })
})

describe('getCreatedTime', () => {
  it('should return created time as a Date object and not null', () => {
    const createdTime = notionTablePage.getCreatedTime('createdTime')
    expect(createdTime).toEqual(new Date('2023-01-01T00:00:00Z'))
  })

  it('should throw an error if createdTime is missing', () => {
    notionTablePage.properties.createdTime = null
    expect(() => notionTablePage.getCreatedTime('createdTime')).toThrowError(
      'Property "createdTime" should not be null'
    )
  })
})

describe('getEmail', () => {
  it('should return email as a string', () => {
    const email = notionTablePage.getEmail('email')
    expect(email).toBe('test@example.com')
  })
})

describe('getFiles', () => {
  it('should return files as an array of objects', () => {
    const files = notionTablePage.getFiles('files')
    expect(files).toEqual([
      { name: 'file1', url: 'https://example.com/file1' },
      { name: 'file2', url: 'https://example.com/file2' },
    ])
  })
})

describe('getStringFormula', () => {
  it('should return string formula as a string', () => {
    const formula = notionTablePage.getStringFormula('stringFormula')
    expect(formula).toBe('Formula String')
  })
})

describe('getNumberFormula', () => {
  it('should return number formula as a number', () => {
    const formula = notionTablePage.getNumberFormula('numberFormula')
    expect(formula).toBe(100)
  })
})

describe('getBooleanFormula', () => {
  it('should return boolean formula as a boolean', () => {
    const formula = notionTablePage.getBooleanFormula('booleanFormula')
    expect(formula).toBe(false)
  })
})

describe('getDateFormula', () => {
  it('should return date formula as a Date object', () => {
    const formula = notionTablePage.getDateFormula('dateFormula')
    expect(formula).toEqual(new Date('2023-02-01T00:00:00Z'))
  })
})

describe('getLastEditedBy', () => {
  it('should return last edited by as a string and not null', () => {
    const lastEditedBy = notionTablePage.getLastEditedBy('lastEditedBy')
    expect(lastEditedBy).toBe('Editor')
  })

  it('should throw an error if lastEditedBy is null', () => {
    notionTablePage.properties.lastEditedBy = null
    expect(() => notionTablePage.getLastEditedBy('lastEditedBy')).toThrowError(
      'Property "lastEditedBy" should not be null'
    )
  })
})

describe('getLastEditedTime', () => {
  it('should return last edited time as a Date object and not null', () => {
    const lastEditedTime = notionTablePage.getLastEditedTime('lastEditedTime')
    expect(lastEditedTime).toEqual(new Date('2023-01-03T00:00:00Z'))
  })

  it('should throw an error if lastEditedTime is null', () => {
    notionTablePage.properties.lastEditedTime = null
    expect(() => notionTablePage.getLastEditedTime('lastEditedTime')).toThrowError(
      'Property "lastEditedTime" should not be null'
    )
  })
})

describe('getMultiSelect', () => {
  it('should return multi-select as an array of strings', () => {
    const multiSelect = notionTablePage.getMultiSelect('multiSelect')
    expect(multiSelect).toEqual(['option1', 'option2'])
  })
})

describe('getNumber', () => {
  it('should return number as a number', () => {
    const number = notionTablePage.getNumber('number')
    expect(number).toBe(42)
  })
})

describe('getPeople', () => {
  it('should return people as an array of strings', () => {
    const people = notionTablePage.getPeople('people')
    expect(people).toEqual(['Person A', 'Person B'])
  })
})

describe('getPhone', () => {
  it('should return phone as a string', () => {
    const phone = notionTablePage.getPhone('phone')
    expect(phone).toBe('123-456-7890')
  })
})

describe('getRelations', () => {
  it('should return relations as an array of strings', () => {
    const relations = notionTablePage.getRelations('relations')
    expect(relations).toEqual(['relation1', 'relation2'])
  })
})

describe('getSingleRelation', () => {
  it('should return the first relation as a string', () => {
    const singleRelation = notionTablePage.getSingleRelation('relations')
    expect(singleRelation).toBe('relation1')
  })

  it('should return null if there are no relations', () => {
    notionTablePage.properties.relations = []
    const singleRelation = notionTablePage.getSingleRelation('relations')
    expect(singleRelation).toBeNull()
  })
})

describe('getNumberArrayRollup', () => {
  it('should return number array rollup as an array of numbers', () => {
    const rollup = notionTablePage.getNumberArrayRollup('numberArrayRollup')
    expect(rollup).toEqual([1, 2, 3])
  })
})

describe('getBooleanArrayRollup', () => {
  it('should return boolean array rollup as an array of booleans', () => {
    const rollup = notionTablePage.getBooleanArrayRollup('booleanArrayRollup')
    expect(rollup).toEqual([true, false, true])
  })
})

describe('getSingleStringRollup', () => {
  it('should return the first string rollup as a string', () => {
    const singleStringRollup = notionTablePage.getSingleStringRollup('stringArrayRollup')
    expect(singleStringRollup).toBe('string1')
  })

  it('should return null if there are no string rollups', () => {
    notionTablePage.properties.stringArrayRollup = []
    const singleStringRollup = notionTablePage.getSingleStringRollup('stringArrayRollup')
    expect(singleStringRollup).toBeNull()
  })
})

describe('getDateRollup', () => {
  it('should return the first date rollup as a Date object', () => {
    const dateRollup = notionTablePage.getDateRollup('dateRollup')
    expect(dateRollup).toEqual(new Date('2023-02-01T00:00:00Z'))
  })

  it('should return null if there is no date rollup', () => {
    notionTablePage.properties.dateRollup = null
    const dateRollup = notionTablePage.getDateRollup('dateRollup')
    expect(dateRollup).toBeNull()
  })
})

describe('getNumberRollup', () => {
  it('should return the first number rollup as a number', () => {
    const numberRollup = notionTablePage.getNumberRollup('numberRollup')
    expect(numberRollup).toBe(1)
  })

  it('should return null if there are no number rollups', () => {
    notionTablePage.properties.numberRollup = null
    const numberRollup = notionTablePage.getNumberRollup('numberRollup')
    expect(numberRollup).toBeNull()
  })
})

describe('getStatus', () => {
  it('should return status as a string', () => {
    const status = notionTablePage.getStatus('status')
    expect(status).toBe('In Progress')
  })
})

describe('getUrl', () => {
  it('should return URL as a string', () => {
    const url = notionTablePage.getUrl('url')
    expect(url).toBe('https://example.com')
  })
})
