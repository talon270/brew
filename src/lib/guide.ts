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
import type { IconName } from '../components/Icons'

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
  /** First sentence, for chapter cards that would otherwise be a bare title. */
  excerpt: string
  readingMinutes: number
  /** Decorative, per chapter. */
  icon: IconName
}

const ICONS: Record<string, IconName> = {
  'what-is-specialty-coffee': 'seedling',
  'grinder-first': 'grinder',
  'buying-and-storing': 'bag',
  'the-variables': 'scale',
  'brew-methods': 'kettle',
  troubleshooting: 'wrench',
  'indian-conditions': 'droplet',
}

/** ~200 words per minute, rounded up, floored at 1. */
function readingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

function firstSentence(markdown: string): string {
  const paragraph = markdown
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.length > 0 && !l.startsWith('#') && !l.startsWith('>') && !l.startsWith('|'))

  if (!paragraph) return ''

  // Strip the markdown that would otherwise show as literal asterisks.
  const plain = paragraph
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\(.*?\)/g, '$1')
    .replace(/`(.+?)`/g, '$1')

  const match = plain.match(/^.*?[.!?](\s|$)/)
  const sentence = (match ? match[0] : plain).trim()
  if (sentence.length <= 150) return sentence

  // Cut on a word boundary — slicing mid-word looks like a rendering bug.
  const cut = sentence.slice(0, 150)
  return `${cut.slice(0, cut.lastIndexOf(' ')).trimEnd()}…`
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

  const slug = nameSlug || slugify(title)

  return {
    slug,
    title,
    order,
    markdown: body,
    html: marked.parse(body, { async: false }) as string,
    excerpt: firstSentence(body),
    readingMinutes: readingMinutes(body),
    icon: ICONS[slug] ?? 'cup',
  }
}

export const GUIDE_SECTIONS: GuideSection[] = Object.entries(files)
  .map(([path, raw]) => parse(path, raw))
  .sort((a, b) => a.order - b.order)

export function getSection(slug: string): GuideSection | undefined {
  return GUIDE_SECTIONS.find((s) => s.slug === slug)
}
