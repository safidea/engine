import AppServer from '../server'

export default function Config() {
  const options = process.argv.slice(3)
  new AppServer().execConfig({
    withCache: !options.includes('--no-cache'),
  })
}
