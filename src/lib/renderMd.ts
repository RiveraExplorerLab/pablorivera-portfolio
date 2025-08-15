import { marked } from 'marked'
import DOMPurify from 'dompurify'

export function renderHtmlFromMd(md: string) {
  const html = marked.parse(md)
  return DOMPurify.sanitize(html as string)
}