import type { RunTypescriptCodeActionConfig } from '@domain/entities/Action/code/RunTypescript'

export interface IRunTypescriptCodeAction extends RunTypescriptCodeActionConfig {
  service: 'Code'
  action: 'RunTypescript'
}
