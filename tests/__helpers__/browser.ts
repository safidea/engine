export function isValidBase64PDF(base64: string): boolean {
  const prefix = 'data:application/pdf;base64,'
  if (!base64.startsWith(prefix)) {
    return false
  }
  const base64Content = base64.substring(prefix.length)
  try {
    atob(base64Content)
    return true
  } catch (e) {
    return false
  }
}
