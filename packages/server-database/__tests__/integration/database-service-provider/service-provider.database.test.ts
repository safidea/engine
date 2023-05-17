import './setup'
import { DatabaseService, DatabaseConfig } from '../../../src'
import { ConfigUtils, TestUtils } from 'server-common'

const TableConfig = {
  validate: () => true,
  lib: () => {
    DatabaseService.addModel('main', 'Task', {
      map: 'tasks',
      fields: {
        id: {
          type: 'Int',
          primary: true,
        },
        name: {
          type: 'String',
        },
      },
    })
  },
}

beforeAll(async () => {
  ConfigUtils.exec([DatabaseConfig, TableConfig])
  await TestUtils.updateLibraries(['server-database'])
  DatabaseService.initLibraries()
})

describe('use app database service', () => {
  it('should create a task', async () => {
    const task = await DatabaseService.create('main', 'tasks', {
      data: {
        id: 1,
        name: 'test',
      },
    })
    expect(task.name).toBe('test')
  })

  it('should read a task', async () => {
    const task = await DatabaseService.readById('main', 'tasks', {
      id: 1,
    })
    expect(task?.name).toBe('test')
  })

  it('should update a task', async () => {
    const task = await DatabaseService.updateById('main', 'tasks', {
      id: 1,
      data: {
        name: 'updated',
      },
    })
    expect(task.name).toBe('updated')
  })

  it('should delete a task', async () => {
    const task = await DatabaseService.deleteById('main', 'tasks', {
      id: 1,
    })
    expect(task.name).toBe('updated')
    const row = await DatabaseService.readById('main', 'tasks', {
      id: 1,
    })
    expect(row).toBe(null)
  })
})
