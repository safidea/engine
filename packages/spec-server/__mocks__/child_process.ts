const mockChildProcess = {
  exec: jest.fn(),
  execFile: jest.fn(),
  execFileSync: jest.fn(),
  execSync: jest.fn(),
  fork: jest.fn(),
  spawn: jest.fn(),
  spawnSync: jest.fn(),
}

export default mockChildProcess
