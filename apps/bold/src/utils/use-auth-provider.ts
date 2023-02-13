// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState, useEffect } from 'react'

export default function useAuthProvider() {
  // Store auth user in state
  // `user` will be object, `null` (loading) or `false` (logged out)
  const [user, setUser] = useState(null)

  // Merge extra user data from the database
  // This means extra user data (such as payment plan) is available as part
  // of `auth.user` and doesn't need to be fetched separately. Convenient!
  let finalUser = useMergeExtraData(user, { enabled: MERGE_DB_USER })

  // Add custom fields and formatting to the `user` object
  finalUser = useFormatUser(finalUser)

  // Handle response from auth functions (`signup`, `signin`, and `signinWithProvider`)
  const handleAuth = async (user) => {
    const isNewUser = (await getUser(user.uid)) ? false : true

    // Create the user in the database if they are new
    if (isNewUser) {
      await createUser(user.uid, { email: user.email })
    }

    // Update user in state
    setUser(user)
    return user
  }

  const signup = (email, password) => {
    return fakeAuth.signup(email, password).then((response) => handleAuth(response.user))
  }

  const signin = (email, password) => {
    return fakeAuth.signin(email, password).then((response) => handleAuth(response.user))
  }

  const signinWithProvider = (name) => {
    return fakeAuth.signinWithProvider(name).then((response) => handleAuth(response.user))
  }

  const signout = () => {
    return fakeAuth.signout()
  }

  const sendPasswordResetEmail = (email) => {
    return fakeAuth.sendPasswordResetEmail(email)
  }

  const confirmPasswordReset = (password, code) => {
    // [INTEGRATING AN AUTH SERVICE]: If not passing in "code" as the second
    // arg above then make sure getFromQueryString() below has the correct
    // url parameter name (it might not be "code").

    // Get code from query string object
    const resetCode = code || getFromQueryString('code')
    return fakeAuth.confirmPasswordReset(password, resetCode)
  }

  const updatePassword = (password) => {
    return fakeAuth.updatePassword(password)
  }

  // Update auth user and persist data to database
  // Call this function instead of multiple auth/db update functions
  const updateProfile = async (data) => {
    const { email, name, picture } = data

    // Update auth email
    if (email) {
      await fakeAuth.updateEmail(email)
    }

    // Update built-in auth profile fields
    // These fields are renamed in `useFormatUser`, so when updating we
    // need to make sure to use their original names (`name`, `picture`, etc)
    if (name || picture) {
      const fields = {}
      if (name) fields.name = name
      if (picture) fields.picture = picture
      await fakeAuth.updateProfile(fields)
    }

    // Persist all data to the database
    await updateUser(user.uid, data)

    // Update user in state
    const currentUser = await fakeAuth.getCurrentUser()
    setUser(currentUser)
  }

  useEffect(() => {
    // Subscribe to user on mount
    const unsubscribe = fakeAuth.onChange(async ({ user }) => {
      if (user) {
        setUser(user)
      } else {
        setUser(false)
      }
    })

    // Unsubscribe on cleanup
    return () => unsubscribe()
  }, [])

  return {
    user: finalUser,
    signup,
    signin,
    signinWithProvider,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
    updatePassword,
    updateProfile,
  }
}
