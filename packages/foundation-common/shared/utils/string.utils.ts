export function isJSON(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function singular(str: string): string {
  return str.endsWith('s') ? str.slice(0, -1) : str
}
