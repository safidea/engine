import type { Environment } from './environment.type'

export type Resource = {
  type: 'javascript'
  environment: Environment
  source: string
}
