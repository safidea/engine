// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: remove ts-nocheck
export default function useFormatUser(user) {
  // Memoize so returned object has a stable identity
  return useMemo(() => {
    // Return if auth user is `null` (loading) or `false` (not authenticated)
    if (!user) return user

    // Create an array of user's auth providers by id, such as ["password", "google", etc]
    // Components can read this to prompt user to re-auth with the correct provider
    const providers = [user.provider]

    return {
      // Include full auth user data
      ...user,

      // User's auth providers
      providers: providers,
    }
  }, [user])
}
