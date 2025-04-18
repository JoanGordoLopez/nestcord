import { ExploreContent } from "@/components/explore/explore-content"

export default function Explore() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="mx-auto flex max-w-7xl">
        <ExploreContent />
      </div>
    </div>
  )
}
