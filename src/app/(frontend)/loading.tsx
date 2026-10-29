import React from 'react'

export default function Loading() {
  return (
    <div className="w-full min-h-[60vh] max-w-6xl mx-auto px-4 py-12 animate-pulse space-y-8" aria-busy="true">
      <div className="h-8 w-64 bg-stone-200 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-200 p-4 space-y-4">
            <div className="w-full aspect-[4/5] bg-stone-200 rounded-xl" />
            <div className="h-4 w-3/4 bg-stone-200 rounded" />
            <div className="h-4 w-1/2 bg-stone-200 rounded" />
            <div className="h-10 w-full bg-stone-200 rounded-full mt-4" />
          </div>
        ))}
      </div>
    </div>
  )
}
