import type { RunJavascript as Config } from '@adapter/api/configs/Action/code/RunJavascript'
import { RunJavascript } from '@domain/entities/Action/code/RunJavascript'
import type { CodeCompiler } from '@domain/services/CodeCompiler'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'

interface Services {
  codeCompiler: CodeCompiler
  templateCompiler: TemplateCompiler
}

export class RunJavascriptMapper {
  static toEntity = (config: Config, services: Services): RunJavascript => {
    const { codeCompiler, templateCompiler } = services
    return new RunJavascript({ ...config, codeCompiler, templateCompiler })
  }
}
