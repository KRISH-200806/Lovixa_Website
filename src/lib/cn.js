import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * Custom font-size tokens (text-h1…text-h5, text-body-*) must be registered so
 * twMerge does not treat them as conflicting with text-{color} utilities.
 * Keep this list in sync with `fontSize` keys in tailwind.config.js.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['h1', 'h2', 'h3', 'h4', 'h5', 'body-xl', 'body-lg', 'body-md', 'body-sm', 'body-xs'],
    },
  },
})

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
