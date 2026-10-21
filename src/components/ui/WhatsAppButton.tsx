'use client'

export function WhatsAppButton() {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919712460509'

  const message = encodeURIComponent('Hello LOVIXA! I would like to know more about your hair care essentials.')

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with LOVIXA on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer"
    >
      <svg
        className="w-7 h-7 sm:w-8 sm:h-8 fill-current"
        viewBox="0 0 24 24"
      >
        <path d="M12.031 2C6.516 2 2.016 6.5 2.016 12.016c0 1.953.563 3.844 1.625 5.484L2 22l4.672-1.609a9.98 9.98 0 0 0 5.359 1.547h.016c5.516 0 10.016-4.5 10.016-10.016 0-2.672-1.047-5.188-2.938-7.078A9.97 9.97 0 0 0 12.031 2zm0 18.234h-.016a8.28 8.28 0 0 1-4.234-1.156l-.313-.188-3.141 1.078 1.047-3.063-.203-.328a8.26 8.26 0 0 1-1.391-4.563c0-4.563 3.719-8.281 8.281-8.281 2.219 0 4.297.859 5.859 2.422a8.25 8.25 0 0 1 2.422 5.859c0 4.563-3.719 8.22-8.312 8.22zm4.547-6.188c-.25-.125-1.469-.734-1.703-.812-.234-.094-.406-.125-.578.125-.172.25-.672.828-.828 1-.156.172-.313.203-.563.078-.25-.125-1.062-.391-2.016-1.25a7.53 7.53 0 0 1-1.391-1.734c-.156-.25-.016-.391.109-.516.109-.109.25-.281.375-.422.125-.141.172-.25.25-.406.078-.172.047-.313-.016-.438-.078-.125-.578-1.406-.812-1.922-.219-.516-.438-.453-.594-.453-.156 0-.328-.016-.5-.016s-.453.063-.688.313c-.234.25-.906.891-.906 2.172s.922 2.516 1.047 2.688c.125.172 1.828 2.781 4.422 3.906.625.266 1.109.438 1.484.563.625.188 1.188.172 1.641.109.5-.078 1.469-.609 1.672-1.203.203-.594.203-1.094.141-1.203-.063-.109-.234-.172-.484-.297z" />
      </svg>
    </a>
  )
}
