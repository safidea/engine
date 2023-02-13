// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: remove ts-nocheck
import qs from 'querystringify'

export default function getFromQueryString(key) {
  return qs.parse(window.location.search)[key]
}
