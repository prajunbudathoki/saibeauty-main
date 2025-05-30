import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_client/services')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_client/services"!</div>
}
