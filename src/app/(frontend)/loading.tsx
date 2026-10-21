export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center py-16">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading content...</p>
      </div>
    </div>
  )
}
