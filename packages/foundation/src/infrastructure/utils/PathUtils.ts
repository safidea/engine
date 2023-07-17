export function getAppFolder(): string {
  return process.env.FOUNDATION_APP_FOLDER || process.cwd()
}
