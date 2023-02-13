// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
export default function useMergeExtraData(user, { enabled }) {
  // Get extra user data from database
  const { data, status, error } = useUser(enabled && user && user.uid)

  // Memoize so returned object has a stable identity
  return useMemo(() => {
    // If disabled or no auth user (yet) then just return
    if (!enabled || !user) return user

    switch (status) {
      case 'success':
        // If successful, but `data` is `null`, that means user just signed up and the `createUser`
        // function hasn't populated the db yet. Return `null` to indicate auth is still loading.
        // The above call to `useUser` will re-render things once the data comes in.
        if (data === null) return null
        // Return auth `user` merged with extra user `data`
        return { ...user, ...data }
      case 'error':
        // Uh oh.. Let's at least show a helpful error.
        throw new Error(`
          Error: ${error.message}
          This happened while attempting to fetch extra user data from the database
          to include with the authenticated user. Make sure the database is setup or
          disable merging extra user data by setting MERGE_DB_USER to false.
        `)
      default:
        // We have an `idle` or `loading` status so return `null`
        // to indicate that auth is still loading.
        return null
    }
  }, [user, enabled, data, status, error])
}
