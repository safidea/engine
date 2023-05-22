import ProcessUtils from '../../src/utils/process.utils'

describe('runCommand', () => {
  it('should run command', () => {
    const output = ProcessUtils.runCommand('echo test')
    expect(output).toBe('test\n')
  })
})
