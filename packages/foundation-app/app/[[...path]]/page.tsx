export const metadata = {
  title: 'Next.js',
}
export default function Page({ params }: { params: { slug: string[] } }) {
  console.log(params)
  return <h1>Hello word</h1>
}
