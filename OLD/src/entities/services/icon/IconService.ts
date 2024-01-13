import { IIconMapper } from './IIconMapper'

export class IconService {
  constructor(readonly mapper: IIconMapper) {}

  get driverName() {
    return this.mapper.driverName
  }
}
