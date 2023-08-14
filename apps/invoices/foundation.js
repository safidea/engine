const Foundation = require('foundation/dist/src/Foundation').default
const fs = require('fs-extra')

;(async () => {
  const foundation = new Foundation({ port: 3000 })
  const config = await fs.readJson('./config.json')
  await foundation.config(config).start()
  console.log(`Foundation app started at http://localhost:3000`)
})()
