import Foundation from './foundation'

export const metadata = {
  title: 'Factures',
}

export default function Page(props) {
  return Foundation.page({ path: '/', ...props })
}
