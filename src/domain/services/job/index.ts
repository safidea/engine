import type { Completed } from './Completed'
import type { Failed } from './Failed'
import type { Pending } from './Pending'

export type Job = Pending | Completed | Failed
