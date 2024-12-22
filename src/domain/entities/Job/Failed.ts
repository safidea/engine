import type { BaseJobParams } from './base'

export class FailedJob {
  constructor(private _params: BaseJobParams) {}
}
