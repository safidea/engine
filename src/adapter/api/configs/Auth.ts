export interface Auth {
  redirectOnLogin: string
  redirectOnLogout: string
  strategy: 'magic-link'
  confirmEmail: {
    subject: string
    text: string
    html: string
  }
  secret: string
}
