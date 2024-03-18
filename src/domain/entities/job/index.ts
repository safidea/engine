import type { Completed } from './Completed'
import type { Failed } from './Failed'
import type { Created } from './Created'
import type { Active } from './Active'

export type Job = Created | Completed | Failed | Active
