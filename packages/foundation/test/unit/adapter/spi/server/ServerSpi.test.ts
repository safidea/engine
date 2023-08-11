import { ServerSpi } from '@adapter/spi/server/ServerSpi'
import { describe, test, expect } from '@jest/globals'

describe('ServerSpi', () => {
  test('should throw an error if we try to start a non configured server', async () => {
    // GIVEN
    const adapters = {
      server: {
        initConfig: jest.fn(),
        configurePages: jest.fn(),
        configureTables: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
      },
      orm: {},
      fetcher: {},
      ui: {},
      log: {},
    } as any

    // WHEN
    const call = () => new ServerSpi(adapters).start()

    // THEN
    await expect(call()).rejects.toThrowError(
      'Invalid Operation: Cannot perform task in current state'
    )
  })

  test('should throw an error if we try to stop a non started server', async () => {
    // GIVEN
    const adapters = {
      server: {
        initConfig: jest.fn(),
        configurePages: jest.fn(),
        configureTables: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
      },
      orm: {},
      fetcher: {},
      ui: {},
      log: {},
    } as any

    // GIVEN
    const server = new ServerSpi(adapters)
    server.config({
      name: 'test',
    })

    // WHEN
    const call = () => server.stop()

    // THEN
    await expect(call()).rejects.toThrowError(
      'Invalid Operation: Cannot perform task in current state'
    )
  })

  test('should throw an error if we try to config a started server', async () => {
    // GIVEN
    const adapters = {
      server: {
        initConfig: jest.fn(),
        configurePages: jest.fn(),
        configureTables: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
      },
      orm: {},
      fetcher: {},
      ui: {},
      log: {},
    } as any

    // GIVEN
    const server = new ServerSpi(adapters)
    server.config({
      name: 'test 1',
    })
    await server.start()

    // WHEN
    const call = () =>
      server.config({
        name: 'test 2',
      })

    // THEN
    expect(call).toThrowError('Invalid Operation: Cannot perform task in current state')
  })
})
