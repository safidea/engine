export const ACCOUNTS_TABLES = {
  users: {
    model: 'User',
    fields: {
      name: {
        type: 'String',
        optional: true,
      },
      email: {
        type: 'String',
        optional: true,
        unique: true,
      },
      email_verified: {
        type: 'DateTime',
        optional: true,
      },
      image: {
        type: 'String',
        optional: true,
      },
      accounts: {
        type: 'Account',
        list: true,
      },
      sessions: {
        type: 'Session',
        list: true,
      },
    },
  },
  accounts: {
    model: 'Account',
    unique: ['provider', 'provider_account_id'],
    fields: {
      user_id: {
        type: 'String',
      },
      type: {
        type: 'String',
      },
      provider: {
        type: 'String',
      },
      provider_account_id: {
        type: 'String',
      },
      refresh_token: {
        type: 'String',
        optional: true,
      },
      access_token: {
        type: 'String',
        optional: true,
      },
      expires_at: {
        type: 'Int',
        optional: true,
      },
      token_type: {
        type: 'String',
        optional: true,
      },
      scope: {
        type: 'String',
        optional: true,
      },
      id_token: {
        type: 'String',
        optional: true,
      },
      session_state: {
        type: 'String',
        optional: true,
      },
      user: {
        type: 'User',
        relation: {
          fields: ['user_id'],
          references: ['id'],
          onDelete: 'Cascade',
        },
      },
    },
  },
  sessions: {
    model: 'Session',
    fields: {
      session_token: {
        type: 'String',
        unique: true,
      },
      user_id: {
        type: 'String',
      },
      expires: {
        type: 'DateTime',
      },
      user: {
        type: 'User',
        relation: {
          fields: ['user_id'],
          references: ['id'],
          onDelete: 'Cascade',
        },
      },
    },
  },
  verification_tokens: {
    model: 'VerificationToken',
    unique: ['identifier', 'token'],
    fields: {
      identifier: {
        type: 'String',
      },
      token: {
        type: 'String',
      },
      expires: {
        type: 'DateTime',
      },
    },
  },
}