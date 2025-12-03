/**
 * SEO Component
 * 
 * Updates document title and meta tags for each page.
 * For Open Graph and Twitter cards, the static tags in index.html
 * work for most crawlers. This component handles dynamic updates
 * for SPA navigation.
 * 
 * Usage:
 *   <SEO title="About" />
 *   <SEO title="Blog Post Title" description="Custom description" />
 */

import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  canonical?: string
  noindex?: boolean
}

const SITE_NAME = 'Pablo Rivera'
const DEFAULT_DESCRIPTION = 'Portfolio of Pablo Rivera. Building thoughtful software with React, TypeScript, and Firebase.'

export default function SEO({ 
  title, 
  description = DEFAULT_DESCRIPTION,
  canonical,
  noindex = false 
}: SEOProps) {
  useEffect(() => {
    // Update document title
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Developer & Systems Thinker`
    document.title = fullTitle

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    }

    // Update OG tags (for JavaScript-rendered crawlers)
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', fullTitle)
    }

    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', description)
    }

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (twitterTitle) {
      twitterTitle.setAttribute('content', fullTitle)
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description)
    }

    // Handle canonical URL
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (canonical) {
      if (!canonicalElement) {
        canonicalElement = document.createElement('link')
        canonicalElement.rel = 'canonical'
        document.head.appendChild(canonicalElement)
      }
      canonicalElement.href = canonical
    }

    // Handle noindex
    let robotsMeta = document.querySelector('meta[name="robots"]')
    if (noindex) {
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta')
        robotsMeta.setAttribute('name', 'robots')
        document.head.appendChild(robotsMeta)
      }
      robotsMeta.setAttribute('content', 'noindex, nofollow')
    } else if (robotsMeta) {
      robotsMeta.remove()
    }

    // Cleanup
    return () => {
      document.title = `${SITE_NAME} — Developer & Systems Thinker`
    }
  }, [title, description, canonical, noindex])

  // This component doesn't render anything
  return null
}

/**
 * Generate structured data for blog posts
 */
export function BlogPostSchema({ 
  title, 
  description, 
  datePublished, 
  author = 'Pablo Rivera',
  image 
}: {
  title: string
  description: string
  datePublished: string
  author?: string
  image?: string
}) {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description,
      datePublished,
      author: {
        '@type': 'Person',
        name: author,
      },
      ...(image && { image }),
    })
    script.id = 'blog-post-schema'
    
    // Remove existing schema
    const existing = document.getElementById('blog-post-schema')
    if (existing) existing.remove()
    
    document.head.appendChild(script)

    return () => {
      const el = document.getElementById('blog-post-schema')
      if (el) el.remove()
    }
  }, [title, description, datePublished, author, image])

  return null
}

/**
 * Generate structured data for projects
 */
export function ProjectSchema({
  name,
  description,
  url,
  image,
}: {
  name: string
  description: string
  url?: string
  image?: string
}) {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name,
      description,
      ...(url && { url }),
      ...(image && { image }),
      applicationCategory: 'WebApplication',
      author: {
        '@type': 'Person',
        name: 'Pablo Rivera',
      },
    })
    script.id = 'project-schema'
    
    const existing = document.getElementById('project-schema')
    if (existing) existing.remove()
    
    document.head.appendChild(script)

    return () => {
      const el = document.getElementById('project-schema')
      if (el) el.remove()
    }
  }, [name, description, url, image])

  return null
}
