import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_client/team')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_client/team"!</div>
}
