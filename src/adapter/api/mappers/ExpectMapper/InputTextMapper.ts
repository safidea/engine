import type { InputText as Config } from '@adapter/api/configs/Expect/InputText'
import { InputText } from '@domain/entities/Expect/InputText'

export class InputTextMapper {
  static toEntity = (config: Config): InputText => {
    return new InputText(config)
  }
}
