import { NotionTablePage } from '@domain/integrations/NotionTablePage'
import { test, expect } from '@playwright/test'

let notionTablePage: NotionTablePage

test.beforeEach(() => {
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
    '2023-01-01T00:00:00Z',
    '2023-01-02T00:00:00Z',
    false
  )
})

test('should return title as a string', () => {
  const title = notionTablePage.getTitle('title')
  expect(title).toBe('Test Title')
})

test('should return checkbox as a boolean', () => {
  const checkbox = notionTablePage.getCheckbox('checkbox')
  expect(checkbox).toBe(true)
})

test('should return createdBy as a string and not null', () => {
  const createdBy = notionTablePage.getCreatedBy('createdBy')
  expect(createdBy).toBe('Creator')
})

test('should throw an error if createdBy is null', () => {
  notionTablePage.properties.createdBy = null
  expect(() => notionTablePage.getCreatedBy('createdBy')).toThrowError(
    'Property "createdBy" should not be null'
  )
})

test('should return created time as a Date object and not null', () => {
  const createdTime = notionTablePage.getCreatedTime('createdTime')
  expect(createdTime).toEqual(new Date('2023-01-01T00:00:00Z'))
})

test('should throw an error if createdTime is missing', () => {
  notionTablePage.properties.createdTime = null
  expect(() => notionTablePage.getCreatedTime('createdTime')).toThrowError(
    'Property "createdTime" should not be null'
  )
})

test('should return email as a string', () => {
  const email = notionTablePage.getEmail('email')
  expect(email).toBe('test@example.com')
})

test('should return files as an array of objects', () => {
  const files = notionTablePage.getFiles('files')
  expect(files).toEqual([
    { name: 'file1', url: 'https://example.com/file1' },
    { name: 'file2', url: 'https://example.com/file2' },
  ])
})

test('should return string formula as a string', () => {
  const formula = notionTablePage.getStringFormula('stringFormula')
  expect(formula).toBe('Formula String')
})

test('should return number formula as a number', () => {
  const formula = notionTablePage.getNumberFormula('numberFormula')
  expect(formula).toBe(100)
})

test('should return boolean formula as a boolean', () => {
  const formula = notionTablePage.getBooleanFormula('booleanFormula')
  expect(formula).toBe(false)
})

test('should return date formula as a Date object', () => {
  const formula = notionTablePage.getDateFormula('dateFormula')
  expect(formula).toEqual(new Date('2023-02-01T00:00:00Z'))
})

test('should return last edited by as a string and not null', () => {
  const lastEditedBy = notionTablePage.getLastEditedBy('lastEditedBy')
  expect(lastEditedBy).toBe('Editor')
})

test('should throw an error if lastEditedBy is null', () => {
  notionTablePage.properties.lastEditedBy = null
  expect(() => notionTablePage.getLastEditedBy('lastEditedBy')).toThrowError(
    'Property "lastEditedBy" should not be null'
  )
})

test('should return last edited time as a Date object and not null', () => {
  const lastEditedTime = notionTablePage.getLastEditedTime('lastEditedTime')
  expect(lastEditedTime).toEqual(new Date('2023-01-03T00:00:00Z'))
})

test('should throw an error if lastEditedTime is null', () => {
  notionTablePage.properties.lastEditedTime = null
  expect(() => notionTablePage.getLastEditedTime('lastEditedTime')).toThrowError(
    'Property "lastEditedTime" should not be null'
  )
})

test('should return multi-select as an array of strings', () => {
  const multiSelect = notionTablePage.getMultiSelect('multiSelect')
  expect(multiSelect).toEqual(['option1', 'option2'])
})

test('should return number as a number', () => {
  const number = notionTablePage.getNumber('number')
  expect(number).toBe(42)
})

test('should return people as an array of strings', () => {
  const people = notionTablePage.getPeople('people')
  expect(people).toEqual(['Person A', 'Person B'])
})

test('should return phone as a string', () => {
  const phone = notionTablePage.getPhone('phone')
  expect(phone).toBe('123-456-7890')
})

test('should return relations as an array of strings', () => {
  const relations = notionTablePage.getRelations('relations')
  expect(relations).toEqual(['relation1', 'relation2'])
})

test('should return number array rollup as an array of numbers', () => {
  const rollup = notionTablePage.getNumberArrayRollup('numberArrayRollup')
  expect(rollup).toEqual([1, 2, 3])
})

test('should return boolean array rollup as an array of booleans', () => {
  const rollup = notionTablePage.getBooleanArrayRollup('booleanArrayRollup')
  expect(rollup).toEqual([true, false, true])
})

test('should return status as a string', () => {
  const status = notionTablePage.getStatus('status')
  expect(status).toBe('In Progress')
})

test('should return URL as a string', () => {
  const url = notionTablePage.getUrl('url')
  expect(url).toBe('https://example.com')
})

test('should throw an error for non-existing property', () => {
  expect(() => notionTablePage.getTitle('nonExisting')).toThrowError(
    'Property "nonExisting" does not exist'
  )
})

test('should return the first relation as a string', () => {
  const singleRelation = notionTablePage.getSingleRelation('relations')
  expect(singleRelation).toBe('relation1')
})

test('should return null if there are no relations', () => {
  notionTablePage.properties.relations = []
  const singleRelation = notionTablePage.getSingleRelation('relations')
  expect(singleRelation).toBeNull()
})

test('should return the first string rollup as a string', () => {
  const singleStringRollup = notionTablePage.getSingleStringRollup('stringArrayRollup')
  expect(singleStringRollup).toBe('string1')
})

test('should return null if there are no string rollups', () => {
  notionTablePage.properties.stringArrayRollup = []
  const singleStringRollup = notionTablePage.getSingleStringRollup('stringArrayRollup')
  expect(singleStringRollup).toBeNull()
})

test('should return the first date rollup as a Date object', () => {
  const dateRollup = notionTablePage.getDateRollup('dateRollup')
  expect(dateRollup).toEqual(new Date('2023-02-01T00:00:00Z'))
})

test('should return null if there is no date rollup', () => {
  notionTablePage.properties.dateRollup = null
  const dateRollup = notionTablePage.getDateRollup('dateRollup')
  expect(dateRollup).toBeNull()
})

test('should return the first number rollup as a number', () => {
  const numberRollup = notionTablePage.getNumberRollup('numberRollup')
  expect(numberRollup).toBe(1)
})

test('should return null if there are no number rollups', () => {
  notionTablePage.properties.numberRollup = null
  const numberRollup = notionTablePage.getNumberRollup('numberRollup')
  expect(numberRollup).toBeNull()
})
