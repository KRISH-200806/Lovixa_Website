import type { Block } from 'payload'

/** Example content section — duplicate pattern for new block types. */
export const ContentBlock: Block = {
  slug: 'content',
  dbName: 'cnt_blk',
  fields: [
    { name: 'heading', type: 'text', required: false },
    { name: 'body', type: 'textarea', required: false },
    { name: 'image', type: 'upload', relationTo: 'media', required: false },
  ],
}

/**
 * FAQ section — renders visibly AND emits FAQPage JSON-LD (see
 * src/components/sections/shared/Faq.tsx, src/lib/seo/jsonld.tsx).
 * FAQPage is the single highest-leverage schema type for GEO/AEO —
 * answer engines lift `answer` text directly into generated responses.
 * Keep each answer self-contained and factually complete.
 */
export const FaqBlock: Block = {
  slug: 'faq',
  dbName: 'faq_blk',
  fields: [
    { name: 'heading', type: 'text', required: false },
    {
      name: 'items',
      type: 'array',
      dbName: 'faq_blk_i',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
}

export const PageBlocks = [ContentBlock, FaqBlock]
