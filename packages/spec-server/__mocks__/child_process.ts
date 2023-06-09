const mockChildProcess = {
  exec: jest.fn((command) =>
    console.warn('exec run but not implemented with this command : ' + command)
  ),
  execFile: jest.fn((command) =>
    console.warn('execFile run but not implemented with this command : ' + command)
  ),
  execFileSync: jest.fn((command) =>
    console.warn('execFileSync run but not implemented with this command : ' + command)
  ),
  execSync: jest.fn((command) =>
    console.warn('execSync run but not implemented with this command : ' + command)
  ),
  fork: jest.fn((command) =>
    console.warn('fork run but not implemented with this command : ' + command)
  ),
  spawn: jest.fn((command) =>
    console.warn('spawn run but not implemented with this command : ' + command)
  ),
  spawnSync: jest.fn((command) =>
    console.warn('spawnSync run but not implemented with this command : ' + command)
  ),
}

export default mockChildProcess
