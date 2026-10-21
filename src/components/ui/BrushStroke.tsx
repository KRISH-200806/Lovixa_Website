export function BrushStroke({ className = 'text-[#6B2D5C]' }: { className?: string }) {
  return (
    <svg
      className={`w-24 sm:w-32 h-2.5 mx-auto -mt-0.5 sm:-mt-1 block ${className}`}
      viewBox="0 0 140 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 10C35 3 105 3 137 10"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M18 12C45 6 95 6 122 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  )
}
