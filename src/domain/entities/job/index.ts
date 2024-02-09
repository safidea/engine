import type { Completed } from './Completed'
import type { Failed } from './Failed'
import type { Created } from './Created'

export type Job = Created | Completed | Failed
