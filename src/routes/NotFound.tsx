import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'
export default function NotFound() {
  const err = useRouteError()
  const msg = isRouteErrorResponse(err) ? `${err.status} ${err.statusText}` : 'Something went wrong'
  return (
    <section className="space-y-3">
      <h1 className="text-3xl font-bold">Not found</h1>
      <p className="text-neutral-300">{msg}</p>
      <Link to="/" className="underline">Go home</Link>
    </section>
  )
}