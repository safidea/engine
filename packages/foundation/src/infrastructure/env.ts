import dotenv from 'dotenv'

const { ENV_FILE } = process.env

if (ENV_FILE) {
  dotenv.config({ path: ENV_FILE })
} else {
  dotenv.config()
}
