import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_client/profile/booking')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_client/profile/booking"!</div>
}
