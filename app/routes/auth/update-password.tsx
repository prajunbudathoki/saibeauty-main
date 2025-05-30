import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/update-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth/update-password"!</div>
}
