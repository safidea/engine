import client from './index'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './',
})

export default createJestConfig({
  ...client,
})
