interface Params {
  table: string
}

export class RecordCreated {
  constructor(private params: Params) {}
}
