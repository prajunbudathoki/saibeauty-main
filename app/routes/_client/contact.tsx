import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_client/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_client/contact"!</div>
}
