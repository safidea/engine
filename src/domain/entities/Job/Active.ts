import type { BaseJobParams } from './base'

export class ActiveJob {
  constructor(private _params: BaseJobParams) {}
}
