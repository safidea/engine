import type { ISchemaValidatorError } from '@domain/drivers/ISchemaValidator'

export class Mapper {
  protected getPaths = (instancePath: string): string[] => {
    return instancePath.split('/').filter((item) => item !== '')
  }

  protected getFirstPath = (instancePath: string): string => {
    return this.getPaths(instancePath)[0]
  }

  protected getMapperError = (error: ISchemaValidatorError): ISchemaValidatorError => {
    const [, index, ...rest] = this.getPaths(error.instancePath)
    return {
      ...error,
      instancePath: rest.join('/'),
      index: Number(index),
    }
  }

  protected mapSchemaValidatorToEngineErrors = <T>(
    errors: ISchemaValidatorError[],
    mapper: (error: ISchemaValidatorError) => T | undefined
  ): T[] => {
    return errors.map(mapper).filter((item): item is T => item !== undefined)
  }
}
