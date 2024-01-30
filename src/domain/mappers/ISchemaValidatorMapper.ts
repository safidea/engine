export interface ISchemaValidatorMapper {
  validateSchema: <T>(schema: unknown) => T
}
