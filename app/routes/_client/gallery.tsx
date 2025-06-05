import { GalleryCard } from '@/components/gallery/gallery-card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_client/gallery')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
    </div>
  )
}
