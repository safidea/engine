export const DEFAULT_FIELDS = {
  id: {
    type: 'string',
    primary: true,
    default: 'uuid()',
  },
  created_at: {
    type: 'datetime',
    nullable: false,
    default: 'now()',
  },
  updated_at: {
    type: 'datetime',
    nullable: false,
    default: 'now()',
  },
  deleted_at: {
    type: 'datetime',
    nullable: true,
  },
}
