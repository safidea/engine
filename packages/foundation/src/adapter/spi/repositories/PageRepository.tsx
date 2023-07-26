import { IUIRepository } from '@domain/repositories/IUIRepository'

export class PageRepository {
  constructor(private readonly _ui: IUIRepository) {}

  getUI(): IUIRepository {
    return this._ui
  }

  useTable(table: string) {
    return {
      records: [],
      error: undefined,
      isLoading: false,
    }
  }
}
