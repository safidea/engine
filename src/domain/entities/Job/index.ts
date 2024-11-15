import type { CompletedJob } from './Completed'
import type { FailedJob } from './Failed'
import type { CreatedJob } from './Created'
import type { ActiveJob } from './Active'

export type Job = CreatedJob | CompletedJob | FailedJob | ActiveJob
