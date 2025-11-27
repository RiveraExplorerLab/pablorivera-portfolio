// src/lib/markdown.ts
import { marked } from 'marked'
import DOMPurify from 'dompurify'

// Configure marked options
marked.setOptions({
  gfm: true,        // GitHub Flavored Markdown
  breaks: true,     // Convert \n to <br>
})

/**
 * Render Markdown to sanitized HTML
 * @param md - The markdown string to render
 * @returns Sanitized HTML string
 */
export function renderMarkdown(md: string): string {
  if (!md) return ''
  
  const rawHtml = marked.parse(md) as string
  
  // Sanitize to prevent XSS
  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel'], // Allow target="_blank" on links
  })
  
  return cleanHtml
}

/**
 * Extract plain text from markdown (for summaries/excerpts)
 * @param md - The markdown string
 * @param maxLength - Maximum length of extracted text
 * @returns Plain text string
 */
export function extractText(md: string, maxLength = 200): string {
  if (!md) return ''
  
  // Remove markdown syntax
  const text = md
    .replace(/#{1,6}\s/g, '')           // Headers
    .replace(/\*\*(.+?)\*\*/g, '$1')    // Bold
    .replace(/\*(.+?)\*/g, '$1')        // Italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Links
    .replace(/`(.+?)`/g, '$1')          // Inline code
    .replace(/```[\s\S]*?```/g, '')     // Code blocks
    .replace(/>\s/g, '')                // Blockquotes
    .replace(/[-*+]\s/g, '')            // List items
    .replace(/\n+/g, ' ')               // Newlines
    .trim()
  
  if (text.length <= maxLength) return text
  
  // Truncate at word boundary
  const truncated = text.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '…'
}

/**
 * Count words in markdown (excluding code blocks)
 * @param md - The markdown string
 * @returns Word count
 */
export function countWords(md: string): number {
  if (!md) return 0
  
  const text = md
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '')        // Remove inline code
  
  const words = text.match(/\b\w+\b/g)
  return words ? words.length : 0
}

/**
 * Estimate reading time
 * @param md - The markdown string
 * @param wordsPerMinute - Reading speed (default 200)
 * @returns Reading time in minutes
 */
export function estimateReadingTime(md: string, wordsPerMinute = 200): number {
  const words = countWords(md)
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}
