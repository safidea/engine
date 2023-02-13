// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useEffect, useContext } from 'react'
import router from 'next/router'
import authContext from './auth-context'

export const useAuth = () => useContext(authContext)

export default function requireAuth(Component) {
  return function RequireAuthHOC(props) {
    // Get authenticated user
    const auth = useAuth()

    useEffect(() => {
      // Redirect if not signed in
      if (auth?.user === false) {
        router.replace('/auth/signin')
      }
    }, [auth])

    // Show loading indicator
    // We're either loading (user is `null`) or about to redirect from above `useEffect` (user is `false`)
    if (!auth?.user) {
      return <span>Loading...</span>
    }

    // Render component now that we have user
    return <Component {...props} />
  }
}
