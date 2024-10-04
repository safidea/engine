import 'dotenv/config'
import { drivers } from '@infrastructure/drivers'
import { AppApi } from '@adapter/api/AppApi'
import type { Drivers as AllDrivers } from '@adapter/spi/Drivers'

export type { App } from '@adapter/api/configs/App'
export type { Table } from '@adapter/api/configs/Table'
export type { Page } from '@adapter/api/configs/Page'
export type { Automation } from '@adapter/api/configs/Automation'
export type { Bucket } from '@adapter/api/configs/Bucket'
export type { Head } from '@adapter/api/configs/Head'
export type { Component } from '@adapter/api/configs/Component'
export type { Action } from '@adapter/api/configs/Action'
export type { Trigger } from '@adapter/api/configs/Trigger'
export type { Field } from '@adapter/api/configs/Field'
export type { Event } from '@adapter/api/configs/Event'
export type { Expect } from '@adapter/api/configs/Expect'
export type { Test } from '@adapter/api/configs/Test'
export type {
  Database,
  Mailer,
  Auth,
  Logger,
  Theme,
  Monitor,
  Server,
} from '@adapter/api/configs/Services'

export type Drivers = Partial<AllDrivers>

export default class extends AppApi {
  constructor(options: Drivers = {}) {
    super({ ...drivers, ...options })
  }
}
