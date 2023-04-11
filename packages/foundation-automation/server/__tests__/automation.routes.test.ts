//import * as TestUtils from 'config-test'
//import type { TestData } from 'config-test'
//import { ConfigService } from 'foundation-common/server'
//import type { NextApiRequest, NextApiResponse } from 'foundation-common'
//import type { Row, Tables, Field } from 'foundation-database'

import ResourceInitializer from '../initializers/resource.initializer'
import ActionInitializer from '../initializers/action.initializer'
//import { AutomationRoutes } from '../'
//import type { Automations } from '../'

//let row: Row
//const automations = ConfigService.get('automations') as Automations
//const { response } = TestUtils

beforeAll(() => {
  ResourceInitializer()
  ActionInitializer()
})
