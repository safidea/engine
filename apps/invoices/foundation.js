const Foundation = require('foundation/dist/src/Foundation').default
const fs = require('fs-extra')

;(async () => {
  const foundation = new Foundation()
  const config = await fs.readJson('./config.json')
  await foundation.config(config)
  const { url } = await foundation.start()
  console.log(`Foundation app started at ${url}`)
})()
