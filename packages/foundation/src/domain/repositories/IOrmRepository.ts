export interface IOrmRepository {
  create(table: string, body: any): Promise<any>
  list(table: string): Promise<any>
  readById(table: string, id: string): Promise<any>
}
