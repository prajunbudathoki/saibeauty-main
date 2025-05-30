import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_client/profile/my-bookings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_client/profile/my-bookings"!</div>
}
