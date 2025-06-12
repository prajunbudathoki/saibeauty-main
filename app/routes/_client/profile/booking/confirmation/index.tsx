import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_client/profile/booking/confirmation/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_client/profile/booking/confirmation/"!</div>
}
