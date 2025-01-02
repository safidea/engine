export interface SyncExpect {
  toBe(expected: any): void
  toEqual(expected: any): void
  toBeNull(): void
  toBeTruthy(): void
  toBeFalsy(): void
  toBeUndefined(): void
  toStrictEqual(expected: any): void
  toHaveLength(expected: number): void
  toContain(expected: any): void
  toBeDefined(): void
  toThrowError(): void
  toThrow(message: string): void
}

export interface AsyncExpect {
  toThrowError(): Promise<void>
  toThrow(message: string): Promise<void>
}

export interface Expect extends SyncExpect {
  not: SyncExpect
  rejects: AsyncExpect | SyncExpect
  resolves: AsyncExpect | SyncExpect
}

export interface TestRunnerBase {
  test: (testName: string, fn: () => Promise<void>) => void
  describe: (description: string, fn: () => void) => void
  it: (testName: string, fn: () => Promise<void>) => void
  expect: (actual: any) => Expect
  beforeAll: (fn: () => Promise<void>) => void
  afterAll: (fn: () => Promise<void>) => void
  beforeEach: (fn: () => Promise<void>) => void
  afterEach: (fn: () => Promise<void>) => void
  env?: {
    [key: string]: string
  }
}

export interface TestRunnerUnit extends TestRunnerBase {
  mock: (...args: any[]) => any
  isIntegration?: undefined
}

export interface TestRunnerIntegration extends TestRunnerBase {
  isIntegration: true
  slow: (ms?: number) => void
}

export type TestRunner = TestRunnerIntegration | TestRunnerUnit
