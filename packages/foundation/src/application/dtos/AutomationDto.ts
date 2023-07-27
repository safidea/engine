export type AutomationDto = {
  name: string
  actions: {
    table: string
    fields: Record<string, string>
  }[]
}
