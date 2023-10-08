import Engine from '../../src/server'
import config from './config'

const folder = __dirname

new Engine(config, { folder, ui: 'tailwind' }).start()
