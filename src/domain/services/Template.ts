type TemplateValue =
  | string
  | {
      number: string
    }
  | {
      boolean: string
    }
  | {
      json: string
    }
  | TemplateObject
  | undefined

export interface TemplateObject {
  [key: string]: TemplateValue
}

export function isTemplateNumberValue(obj: TemplateValue): obj is { number: string } {
  return (
    typeof obj === 'object' && obj !== null && 'number' in obj && typeof obj.number === 'string'
  )
}

export function isTemplateBooleanValue(obj: TemplateValue): obj is { boolean: string } {
  return (
    typeof obj === 'object' && obj !== null && 'boolean' in obj && typeof obj.boolean === 'string'
  )
}

export function isTemplateJsonValue(obj: TemplateValue): obj is { json: string } {
  return typeof obj === 'object' && obj !== null && 'json' in obj && typeof obj.json === 'string'
}

export type TemplateObjectCompiled = {
  [key: string]:
    | Template
    | { number: Template }
    | { boolean: Template }
    | { json: Template }
    | TemplateObjectCompiled
    | undefined
}

export type TemplateObjectFilled = {
  [key: string]: string | number | boolean | TemplateObjectFilled | undefined
}

export type ConvertToTemplateObject<T> = {
  [K in keyof T]: T[K] extends object ? ConvertToTemplateObject<T[K]> : TemplateValue
}

export type ConvertToTemplateObjectCompiled<T> = {
  [K in keyof T]: T[K] extends string
    ? Template
    : T[K] extends string | undefined
      ? Template | undefined
      : T[K] extends object
        ? ConvertToTemplateObjectCompiled<T[K]>
        : T[K] extends object | undefined
          ? ConvertToTemplateObjectCompiled<T[K]> | undefined
          : never
}

export type ConvertToTemplateObjectFilled<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends string | undefined
      ? string | undefined
      : T[K] extends number
        ? number
        : T[K] extends number | undefined
          ? number | undefined
          : T[K] extends boolean
            ? boolean
            : T[K] extends boolean | undefined
              ? boolean | undefined
              : T[K] extends object
                ? ConvertToTemplateObjectFilled<T[K]>
                : T[K] extends object | undefined
                  ? ConvertToTemplateObjectFilled<T[K]> | undefined
                  : never
}

export interface ITemplateSpi {
  fill: (data: { [key: string]: unknown }) => string
}

export class Template {
  constructor(private _spi: ITemplateSpi) {}

  fill = (data: { [key: string]: unknown }): string => {
    return this._spi.fill(data)
  }

  static fillObject = <T extends TemplateObjectFilled>(
    object: TemplateObjectCompiled,
    data: { [key: string]: unknown }
  ): T => {
    const result: TemplateObjectFilled = {}
    for (const key in object) {
      const value = object[key]
      if (value instanceof Template) {
        result[key] = value.fill(data)
      } else if (typeof value === 'object') {
        if ('number' in value && value.number instanceof Template) {
          result[key] = Number(value.number.fill(data))
        } else if ('boolean' in value && value.boolean instanceof Template) {
          result[key] = value.boolean.fill(data) === 'true' || value.boolean.fill(data) === '1'
        } else if ('json' in value && value.json instanceof Template) {
          result[key] = JSON.parse(value.json.fill(data))
        } else {
          result[key] = this.fillObject(value, data)
        }
      }
    }
    return result as T
  }
}
