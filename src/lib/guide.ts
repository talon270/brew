/**
 * Guide loader.
 *
 * Guide content is author-controlled editorial writing, so it lives in git as
 * Markdown rather than in a database: version history for free, no admin UI to
 * build, and it ships inside the bundle so it works offline.
 *
 * Add a section by dropping a numbered file into content/guide/. The number
 * sets the order and the first `# heading` becomes the title.
 */

import { marked } from 'marked'

const files = import.meta.glob('../../content/guide/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export interface GuideSection {
  slug: string
  title: string
  order: number
  markdown: string
  html: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function parse(path: string, raw: string): GuideSection {
  const filename = path.split('/').pop() ?? path
  const match = filename.match(/^(\d+)-(.*)\.md$/)
  const order = match ? Number(match[1]) : 999
  const nameSlug = match ? match[2] : filename.replace(/\.md$/, '')

  const titleLine = raw.split('\n').find((l) => l.startsWith('# '))
  const title = titleLine ? titleLine.slice(2).trim() : nameSlug

  // Drop the H1 from the body — the page renders the title itself.
  const body = titleLine ? raw.replace(titleLine, '').trim() : raw

  return {
    slug: nameSlug || slugify(title),
    title,
    order,
    markdown: body,
    html: marked.parse(body, { async: false }) as string,
  }
}

export const GUIDE_SECTIONS: GuideSection[] = Object.entries(files)
  .map(([path, raw]) => parse(path, raw))
  .sort((a, b) => a.order - b.order)

export function getSection(slug: string): GuideSection | undefined {
  return GUIDE_SECTIONS.find((s) => s.slug === slug)
}
