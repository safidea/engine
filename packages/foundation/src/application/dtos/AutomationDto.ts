export type AutomationDto = {
  name: string
  actions: {
    type: 'updateTable'
    table: string
    fields: Record<string, string>
  }[]
}
