import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number | null
  size?: "sm" | "md" | "lg"
  showEmpty?: boolean
}

export function StarRating({ rating, size = "md", showEmpty = true }: StarRatingProps) {
  if (rating === null && !showEmpty) {
    return null
  }

  const sizeClass = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }[size]

  return (
    <div className="flex">
      {rating === null ? (
        <span className="text-sm text-muted-foreground">No ratings yet</span>
      ) : (
        <>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`${sizeClass} ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </>
      )}
    </div>
  )
}

