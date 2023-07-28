export interface ICodegenGateway {
  runScript: (
    script: string,
    context: {
      [key: string]:
        | string
        | number
        | boolean
        | undefined
        | (number | string | boolean | undefined)[]
    },
    functions: { [key: string]: string }
  ) => Promise<string | number | boolean | undefined>
}
