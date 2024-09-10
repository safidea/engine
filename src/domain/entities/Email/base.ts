export interface EmailFields {
  id: string
  from: string
  to: string
  subject: string
  text: string
  html: string
}

export type EmailJson = EmailFields

export class Base {
  constructor(private _fields: EmailFields) {}

  get id(): string {
    return this._fields.id
  }

  get from(): string {
    return this._fields.from
  }

  get to(): string {
    return this._fields.to
  }

  get subject(): string {
    return this._fields.subject
  }

  get text(): string {
    return this._fields.text
  }

  get html(): string {
    return this._fields.html
  }

  toJson(): EmailJson {
    return this._fields
  }
}
