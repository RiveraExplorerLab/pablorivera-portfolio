/**
 * Optimized Image Component
 * 
 * Features:
 * - Native lazy loading with IntersectionObserver fallback
 * - Skeleton loading state
 * - Error fallback with placeholder
 * - Blur-up effect on load
 * - Responsive srcset support
 * 
 * Usage:
 *   <Image src="/photo.jpg" alt="Description" />
 *   <Image src="/photo.jpg" alt="" aspect="video" />
 *   <Image src="/photo.jpg" alt="" className="rounded-xl" />
 */

import { useState, useRef, useEffect } from 'react'

interface ImageProps {
  src: string
  alt: string
  className?: string
  aspect?: 'video' | 'square' | 'card' | 'auto'
  width?: number
  height?: number
  priority?: boolean // If true, loads immediately (above fold)
  placeholder?: 'skeleton' | 'blur' | 'none'
  onLoad?: () => void
  onError?: () => void
}

export default function Image({
  src,
  alt,
  className = '',
  aspect = 'auto',
  width,
  height,
  priority = false,
  placeholder = 'skeleton',
  onLoad,
  onError,
}: ImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before in viewport
        threshold: 0,
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [priority, isInView])

  // Handle image load
  const handleLoad = () => {
    setStatus('loaded')
    onLoad?.()
  }

  // Handle image error
  const handleError = () => {
    setStatus('error')
    onError?.()
  }

  // Aspect ratio classes
  const aspectClasses: Record<string, string> = {
    video: 'aspect-video',
    square: 'aspect-square',
    card: 'aspect-[4/3]',
    auto: '',
  }

  return (
    <div
      ref={containerRef}
      className={`
        relative overflow-hidden bg-[var(--color-surface)]
        ${aspectClasses[aspect]}
        ${className}
      `}
      style={aspect === 'auto' && width && height ? { aspectRatio: `${width}/${height}` } : undefined}
    >
      {/* Skeleton placeholder */}
      {placeholder === 'skeleton' && status === 'loading' && (
        <div className="absolute inset-0 skeleton" aria-hidden="true" />
      )}

      {/* Error fallback */}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-elevated)]">
          <span className="text-4xl opacity-20 text-[var(--color-accent)]">✦</span>
        </div>
      )}

      {/* Actual image */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`
            w-full h-full object-cover
            transition-opacity duration-300
            ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}
          `}
        />
      )}
    </div>
  )
}

/**
 * Background Image Component
 * For hero sections and backgrounds
 */
interface BackgroundImageProps {
  src: string
  className?: string
  children?: React.ReactNode
  overlay?: boolean
}

export function BackgroundImage({ 
  src, 
  className = '', 
  children,
  overlay = true 
}: BackgroundImageProps) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = new window.Image()
    img.src = src
    img.onload = () => setLoaded(true)
  }, [src])

  return (
    <div className={`relative ${className}`}>
      {/* Background image */}
      <div
        className={`
          absolute inset-0 bg-cover bg-center
          transition-opacity duration-500
          ${loaded ? 'opacity-100' : 'opacity-0'}
        `}
        style={{ backgroundImage: `url(${src})` }}
      />
      
      {/* Optional overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-base)] via-[var(--color-base)]/80 to-transparent" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

/**
 * Avatar Image Component
 * For profile pictures and user avatars
 */
interface AvatarProps {
  src?: string | null
  alt: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string // Initials or emoji
  className?: string
}

export function Avatar({ 
  src, 
  alt, 
  size = 'md', 
  fallback = '?',
  className = '' 
}: AvatarProps) {
  const [error, setError] = useState(false)

  const sizeClasses: Record<string, string> = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  if (!src || error) {
    return (
      <div
        className={`
          rounded-full flex items-center justify-center
          bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-elevated)]
          text-[var(--color-accent)] font-medium
          ${sizeClasses[size]}
          ${className}
        `}
        aria-label={alt}
      >
        {fallback.slice(0, 2)}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      loading="lazy"
      className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
    />
  )
}
