export interface JobDto {
  id: string
  name: string
  data: string | object
  state:
    | 'retry'
    | 'created'
    | 'active'
    | 'completed'
    | 'expired'
    | 'cancelled'
    | 'failed'
    | 'pending'
  retryCount: number
}
