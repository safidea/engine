import type { EmailExpectConfig } from '@domain/entities/Expect/Email'

export interface IEmailExpect extends EmailExpectConfig {
  expect: 'Email'
}
