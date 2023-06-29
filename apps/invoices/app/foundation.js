import Foundation from 'foundation'
import Image from 'next/image'
import Link from 'next/link'
import orm from './orm'
import * as Components from '../components'

export default new Foundation({
  components: { Image, Link, ...Components },
  orm,
})
