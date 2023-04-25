class StringUtils {
  public isJSON(str: string): boolean {
    try {
      JSON.parse(str)
      return true
    } catch (e) {
      return false
    }
  }

  public capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  public singular(str: string): string {
    return str.endsWith('s') ? str.slice(0, -1) : str
  }
}

export default new StringUtils()
