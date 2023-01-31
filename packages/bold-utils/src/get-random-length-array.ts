export default function getRandomLengthArray(max = 10): number[] {
  const length = Math.floor(Math.random() * max)
  return Array.from({ length }, (v, k) => k)
}
