import './setup'
import TableService from '../../src/services/table.service'
import { DatabaseService } from 'server-database'

describe('create', () => {
  it('should return a row', async () => {
    const result = await TableService.create('master', 'User', {
      data: {
        name: 'test',
      },
    })
    expect(result).toEqual({ id: '1', name: 'test' })
  })
})

describe('read', () => {
  it('should return a row', async () => {
    const result = await TableService.read('master', 'User', {
      id: '1',
    })
    expect(result).toEqual({ id: '1', name: 'test' })
  })
})

describe('update', () => {
  it('should return a row with updated_at property', async () => {
    jest.spyOn(DatabaseService, 'updateById')
    const result = await TableService.update('master', 'User', {
      id: '1',
      data: {
        name: 'test',
      },
    })
    expect(result).toEqual({ id: '1', name: 'test' })
    expect(DatabaseService.updateById).toBeCalledWith('master', 'User', {
      id: '1',
      data: {
        name: 'test',
        updated_at: expect.any(String),
      },
    })
  })
})

describe('delete', () => {
  it('should return a row with deleted_at property', async () => {
    const result = await TableService.delete('master', 'User', {
      id: '1',
    })
    expect(result).toEqual({ id: '1', name: 'test' })
    expect(DatabaseService.updateById).toBeCalledWith('master', 'User', {
      id: '1',
      data: {
        deleted_at: expect.any(String),
      },
    })
  })
})

describe('list', () => {
  it('should return a row', async () => {
    const result = await TableService.list('master', 'User')
    expect(result).toHaveLength(2)
  })
})
