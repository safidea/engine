export type TestRunner = {
  describe: any
  it: any
  expect: any
  slow?: any
  env?: {
    [key: string]: string
  }
}
