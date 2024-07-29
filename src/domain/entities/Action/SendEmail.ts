import type { ToSend } from '@domain/entities/Email/ToSend'
import { Base, type Params as BaseParams, type Interface } from './base'
import type { Mailer } from '@domain/services/Mailer'
import type { Context } from '../Automation/Context'

interface Params extends BaseParams {
  emailToSend: ToSend
  mailer: Mailer
}

export class SendEmail extends Base implements Interface {
  constructor(private _params: Params) {
    super(_params)
  }

  execute = async (context: Context) => {
    const { emailToSend, mailer } = this._params
    const emailToSendFilled = emailToSend.fillWithContext(context)
    await mailer.send(emailToSendFilled)
  }
}
