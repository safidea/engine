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

  public lowarize(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1)
  }

  public singular(str: string): string {
    return str.endsWith('s') ? str.slice(0, -1) : str
  }

  public slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
  }
}

export default new StringUtils()
