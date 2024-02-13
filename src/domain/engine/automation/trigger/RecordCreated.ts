interface Params {
  table: string
}

export interface Result {}

export class RecordCreated {
  constructor(private params: Params) {}
}
