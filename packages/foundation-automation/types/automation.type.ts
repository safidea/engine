export type Automation = {
  trigger: {
    type: 'http'
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    path: string
  }
  actions: {
    [key: string]: {
      [key: string]: string
    }
  }
  tests: {
    [key: string]: {
      input: {
        [key: string]: ValueType
      }
      output: {
        [key: string]: ValueType
      }
    }
  }
}
