export interface Auth {
  redirectOnLogin: string
  providers: {
    name: 'magic-link'
    email: {
      from: string
      to: string
      subject: string
      text: string
      html: string
    }
  }[]
}
