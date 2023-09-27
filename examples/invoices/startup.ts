import Engine from '../../src/server'
import config from './config'

const folder = __dirname

new Engine({ folder, ui: 'tailwind' }).start(config)
