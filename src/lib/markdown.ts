// src/lib/markdown.ts
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { createHighlighter, type Highlighter } from 'shiki'

// Singleton highlighter instance
let highlighterPromise: Promise<Highlighter> | null = null

/**
 * Get or create the Shiki highlighter instance
 */
async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: [
        'javascript',
        'typescript',
        'jsx',
        'tsx',
        'html',
        'css',
        'json',
        'markdown',
        'bash',
        'shell',
        'python',
        'rust',
        'go',
        'sql',
        'yaml',
        'toml',
        'diff',
      ],
    })
  }
  return highlighterPromise
}

/**
 * Highlight code with Shiki
 */
async function highlightCode(code: string, lang: string): Promise<string> {
  try {
    const highlighter = await getHighlighter()
    
    // Map common language aliases
    const langMap: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'sh': 'bash',
      'zsh': 'bash',
      'yml': 'yaml',
      'py': 'python',
      'rs': 'rust',
    }
    
    const normalizedLang = langMap[lang] || lang
    const supportedLangs = highlighter.getLoadedLanguages()
    
    if (!supportedLangs.includes(normalizedLang as any)) {
      // Fallback to plain text styling
      return `<pre class="shiki" style="background-color:#0d1117;color:#c9d1d9"><code>${escapeHtml(code)}</code></pre>`
    }
    
    return highlighter.codeToHtml(code, {
      lang: normalizedLang,
      theme: 'github-dark',
    })
  } catch (error) {
    console.error('Shiki highlighting error:', error)
    return `<pre><code>${escapeHtml(code)}</code></pre>`
  }
}

/**
 * Escape HTML characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Configure marked options
marked.setOptions({
  gfm: true,        // GitHub Flavored Markdown
  breaks: true,     // Convert \n to <br>
})

/**
 * Render Markdown to sanitized HTML (sync version - no syntax highlighting)
 * Use renderMarkdownAsync for syntax highlighting
 */
export function renderMarkdown(md: string): string {
  if (!md) return ''
  
  const rawHtml = marked.parse(md) as string
  
  // Sanitize to prevent XSS
  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel', 'style', 'class'],
  })
  
  return cleanHtml
}

/**
 * Render Markdown to sanitized HTML with Shiki syntax highlighting
 */
export async function renderMarkdownAsync(md: string): Promise<string> {
  if (!md) return ''
  
  // Extract code blocks and replace with unique placeholders
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g
  const codeBlocks: Map<string, string> = new Map()
  
  // Collect all code blocks first
  const matches: { full: string; lang: string; code: string }[] = []
  let match
  while ((match = codeBlockRegex.exec(md)) !== null) {
    matches.push({
      full: match[0],
      lang: match[1] || 'text',
      code: match[2].trim(),
    })
  }
  
  // Highlight all code blocks in parallel
  const highlightedBlocks = await Promise.all(
    matches.map(async (m, i) => {
      const highlighted = await highlightCode(m.code, m.lang)
      // Use a unique HTML comment as placeholder (won't be altered by marked)
      const placeholder = `<!--CODEBLOCK${i}-->`
      return { full: m.full, placeholder, highlighted }
    })
  )
  
  // Replace code blocks with placeholders before parsing
  let processedMd = md
  for (const block of highlightedBlocks) {
    processedMd = processedMd.replace(block.full, block.placeholder)
    codeBlocks.set(block.placeholder, block.highlighted)
  }
  
  // Parse markdown (this won't touch HTML comments)
  const rawHtml = marked.parse(processedMd) as string
  
  // Replace placeholders with highlighted code
  let finalHtml = rawHtml
  for (const [placeholder, highlighted] of codeBlocks) {
    // Handle case where placeholder might be wrapped in <p> tags
    finalHtml = finalHtml.replace(`<p>${placeholder}</p>`, highlighted)
    finalHtml = finalHtml.replace(placeholder, highlighted)
  }
  
  // Sanitize to prevent XSS, but allow Shiki's styles and spans
  const cleanHtml = DOMPurify.sanitize(finalHtml, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel', 'style', 'class'],
    ADD_TAGS: ['span'],
  })
  
  return cleanHtml
}

/**
 * Extract plain text from markdown (for summaries/excerpts)
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
 */
export function estimateReadingTime(md: string, wordsPerMinute = 200): number {
  const words = countWords(md)
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}
