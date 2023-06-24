import Config from './commands/config'

const [cmd] = process.argv.slice(2)

if (cmd === 'config') {
  Config()
} else {
  console.log('Unknown sub-command:', cmd)
}
