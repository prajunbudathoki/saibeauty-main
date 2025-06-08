import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/appointments/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/appointments/"!</div>
}
