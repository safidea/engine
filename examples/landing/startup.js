/* eslint-disable @typescript-eslint/no-var-requires */

const Engine = require('../../dist/server')
const config = require('./config')

const folder = __dirname

new Engine(config, { folder, ui: 'tailwind' }).start()
