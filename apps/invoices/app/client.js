import AppClient from 'foundation/client'
    import Image from 'next/image'
    import Link from 'next/link'
    import * as Components from '../components'

    export default function NextAppClient({ page }) {
      return <AppClient appProviderComponents={{ Image, Link, ...Components }} page={page} />
    }