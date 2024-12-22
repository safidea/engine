import { InputTextExpect, type InputTextExpectConfig } from '@domain/entities/Expect/InputText'

export class InputTextExpectMapper {
  static toEntity = (config: InputTextExpectConfig): InputTextExpect => {
    return new InputTextExpect(config)
  }
}
