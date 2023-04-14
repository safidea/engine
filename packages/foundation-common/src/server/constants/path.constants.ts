import { join } from 'path'

const isNext = __dirname.search('.next') > -1

export const DATA_FOLDER_PATH = process.env.DATA_FOLDER_PATH || './data'
export const ROOT_PATH = join(__dirname, isNext ? '../../..' : '', '../../../..')
export const CONFIG_CACHE_PATH = join(ROOT_PATH, DATA_FOLDER_PATH, `config.cache.json`)
