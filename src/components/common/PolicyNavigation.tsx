'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Truck, RotateCcw, FileText, ShieldCheck, HelpCircle, Mail } from 'lucide-react'

const POLICY_LINKS = [
  { name: 'Shipping Policy', href: '/shipping-policy', icon: Truck },
  { name: 'Return & Refund', href: '/return-refund-policy', icon: RotateCcw },
  { name: 'Terms of Service', href: '/terms-conditions', icon: FileText },
  { name: 'Privacy Policy', href: '/privacy-policy', icon: ShieldCheck },
  { name: 'FAQs & Guidance', href: '/faq', icon: HelpCircle },
  { name: 'Contact Concierge', href: '/contact', icon: Mail },
]

export function PolicyNavigation() {
  const pathname = usePathname()

  return (
    <div className="pt-8 border-t border-[#E8C4D4]/60">
      <h3 className="text-xs uppercase tracking-widest text-[#6B2D5C] font-bold font-sans mb-3">
        Explore Customer Policies &amp; Guidance
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {POLICY_LINKS.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              scroll={true}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-[#6B2D5C] text-white border-[#6B2D5C] shadow-xs'
                  : 'bg-white text-[#2B1822] border-[#E8C4D4]/70 hover:border-[#6B2D5C] hover:text-[#6B2D5C] hover:bg-[#FBF6F8]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#6B2D5C]'}`} />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
