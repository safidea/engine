export interface Database {
  host: string
  port: string
  username: string
  password: string
  database: string
  provider: 'sqlite' | 'mysql' | 'postgresql' | 'sqlserver' | 'mongodb' | 'cockroachdb'
}

export interface CRUDPermissions {
  create: string[]
  update: string[]
  read: string[]
  delete: string[]
}

export interface Table {
  model?: string
  unique?: string[]
  database?: string
  permissions?: CRUDPermissions
  fields: {
    [key: string]: Field
  }
}

export interface Field {
  type: string
  primary?: boolean
  optional?: boolean
  list?: boolean
  default?: string | number | boolean
  unique?: boolean
  permissions?: CRUDPermissions
  relation?: {
    fields: string[]
    references: string[]
    onDelete: string
  }
}

export interface Account {
  database: string
  auth: string
  roles: string[]
}

export interface Test {
  input: {
    [key: string]: string
  }
  output: {
    [key: string]: string
  }
}

export interface Automation {
  trigger: {
    type: string
    method: string
    path: string
  }
  history: {
    database: string
  }
  permissions: string[]
  actions: {
    [key: string]: {
      input: {
        [key: string]: string
      }
    }
  }
  tests: {
    [key: string]: Test
  }
}

export interface Action {
  input: {
    [key: string]: string
  }
  output: {
    [key: string]: string
  }
  permissions: string[]
  integrations: string[]
  source: string
  tests: {
    [key: string]: Test
  }
}

export interface Integration {
  package: string
  source: string
}

export interface Component {}

export interface Interface {}

export interface Page {}

export interface Theme {}

export interface Language {}

export interface Storage {}

export interface Config {
  databases: {
    [key: string]: Database
  }
  tables: {
    [key: string]: Table
  }
  accounts: {
    [key: string]: Account
  }
  automations: {
    [key: string]: Automation
  }
  actions: {
    [key: string]: Action
  }
  integrations: {
    [key: string]: Integration
  }
  components: {
    [key: string]: Component
  }
  interfaces: {
    [key: string]: Interface
  }
  pages: {
    [key: string]: Page
  }
  themes: {
    [key: string]: Theme
  }
  languages: {
    [key: string]: Language
  }
  storages: {
    [key: string]: Storage
  }
}
