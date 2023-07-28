const Foundation = require('foundation').default
const fs = require('fs-extra')
const { join } = require('path')

const config = fs.readJsonSync('./config.json')
const folder = join(process.cwd(), 'app')

const foundation = new Foundation(config, folder, 3000)

foundation.start()
