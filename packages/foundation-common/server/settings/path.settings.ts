import { join } from 'path'

const isNext = __dirname.search('.next') > -1

export const DATA_FOLDER = process.env.DATA_FOLDER || './data'
export const ROOT_PATH = join(__dirname, isNext ? '../../..' : '', '../../../..')
