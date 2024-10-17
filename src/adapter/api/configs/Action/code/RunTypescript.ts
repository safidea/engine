import type { Config } from '@domain/entities/Action/code/RunTypescript'

export interface RunTypescript extends Config {
  service: 'Code'
  action: 'RunTypescript'
}
