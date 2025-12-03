/**
 * Skeleton Loading Components
 * 
 * Usage:
 *   <Skeleton />                    - Basic skeleton line
 *   <Skeleton variant="title" />    - Larger title skeleton
 *   <Skeleton variant="avatar" />   - Circular avatar
 *   <Skeleton variant="image" />    - 16:9 image placeholder
 *   <Skeleton variant="card" />     - Full card skeleton
 *   <Skeleton variant="button" />   - Button skeleton
 *   
 *   <Skeleton width="200px" />      - Custom width
 *   <Skeleton height="100px" />     - Custom height
 *   <Skeleton className="..." />    - Additional classes
 *   
 *   <SkeletonCard />                - Pre-built project card skeleton
 *   <SkeletonBlogPost />            - Pre-built blog post skeleton
 */

interface SkeletonProps {
  variant?: 'text' | 'title' | 'avatar' | 'image' | 'card' | 'button'
  width?: string
  height?: string
  className?: string
}

export function Skeleton({ 
  variant = 'text', 
  width, 
  height, 
  className = '' 
}: SkeletonProps) {
  const variantClasses: Record<string, string> = {
    text: 'skeleton skeleton-text',
    title: 'skeleton skeleton-title',
    avatar: 'skeleton skeleton-avatar',
    image: 'skeleton skeleton-image w-full',
    card: 'skeleton skeleton-card',
    button: 'skeleton skeleton-button',
  }

  return (
    <div 
      className={`${variantClasses[variant]} ${className}`}
      style={{ 
        width: width || undefined, 
        height: height || undefined 
      }}
      aria-hidden="true"
    />
  )
}

// Pre-built skeleton for project cards
export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-4">
      <Skeleton variant="image" />
      <div className="space-y-2">
        <Skeleton variant="title" />
        <Skeleton width="100%" />
        <Skeleton width="80%" />
      </div>
      <div className="flex gap-2">
        <Skeleton width="60px" height="24px" />
        <Skeleton width="60px" height="24px" />
        <Skeleton width="60px" height="24px" />
      </div>
    </div>
  )
}

// Pre-built skeleton for blog posts
export function SkeletonBlogPost() {
  return (
    <div className="card p-5 space-y-4">
      <Skeleton variant="image" />
      <div className="space-y-2">
        <Skeleton variant="title" width="80%" />
        <Skeleton width="100%" />
        <Skeleton width="90%" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton width="80px" height="16px" />
        <Skeleton width="60px" height="16px" />
      </div>
    </div>
  )
}

// Pre-built skeleton for tool/stack items
export function SkeletonTool() {
  return (
    <div className="card p-4 flex items-start gap-4">
      <Skeleton variant="avatar" className="w-10 h-10" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="title" width="50%" />
        <Skeleton width="100%" />
        <Skeleton width="70%" />
      </div>
    </div>
  )
}

// Pre-built skeleton for list items
export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-3 py-3">
      <Skeleton variant="avatar" className="w-8 h-8" />
      <div className="flex-1 space-y-1">
        <Skeleton width="60%" />
        <Skeleton width="40%" height="12px" />
      </div>
    </div>
  )
}

// Skeleton grid for multiple cards
interface SkeletonGridProps {
  count?: number
  variant?: 'card' | 'blog' | 'tool'
}

export function SkeletonGrid({ count = 6, variant = 'card' }: SkeletonGridProps) {
  const Component = {
    card: SkeletonCard,
    blog: SkeletonBlogPost,
    tool: SkeletonTool,
  }[variant]

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  )
}

export default Skeleton
