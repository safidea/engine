/* eslint-disable @typescript-eslint/no-var-requires */
const JsonSchemaStaticDocs = require('json-schema-static-docs')

;(async () => {
  let jsonSchemaStaticDocs = new JsonSchemaStaticDocs({
    inputPath: 'schemas',
    outputPath: 'docs',
    ajvOptions: {
      allowUnionTypes: true,
    },
  })
  await jsonSchemaStaticDocs.generate()
  console.log('Documents generated.')
})()
