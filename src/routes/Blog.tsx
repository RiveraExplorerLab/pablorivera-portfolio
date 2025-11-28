// src/routes/Blog.tsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePosts } from '../hooks/useBlogPosts'
import { estimateReadingTime } from '../lib/markdown'
import type { BlogPost } from '../lib/types'

export default function Blog() {
  const { data: posts, loading, error } = usePosts(30)

  if (loading) return <p className="text-stone-400 text-sm">Loading…</p>
  if (error) return <p className="text-rose-400 text-sm">Error: {error}</p>
  if (!posts?.length) return (
    <div className="card p-8 text-center">
      <p className="text-stone-300">Nothing here yet.</p>
      <div className="mt-4">
        <Link to="/projects" className="btn-primary">
          See projects instead →
        </Link>
      </div>
    </div>
  )

  // Split into featured (first) and rest
  const [featured, ...rest] = posts

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-100 flex items-center gap-3">
          <span className="inline-block size-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400" />
          Blog
        </h1>
        <p className="text-stone-400">Notes, ideas, and progress logs.</p>
      </header>

      {/* Featured Post */}
      {featured && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          aria-label="Featured post"
        >
          <Link
            to={`/blog/${featured.slug}`}
            className="group block card overflow-hidden no-underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-teal-500/60"
          >
            <div className="grid md:grid-cols-2 gap-0">
              {featured.coverImage ? (
                <div className="relative h-56 md:h-72 overflow-hidden">
                  <img
                    src={featured.coverImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/80 md:block hidden" />
                </div>
              ) : (
                <div className="h-56 md:h-72 bg-gradient-to-br from-teal-500/20 to-cyan-500/10 flex items-center justify-center">
                  <span className="text-6xl text-teal-400/30">✦</span>
                </div>
              )}
              <div className="p-6 md:p-8 flex flex-col justify-center space-y-4">
                <div className="flex items-center gap-3 text-xs">
                  <span className="px-2 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    Latest
                  </span>
                  <span className="text-stone-500">
                    {estimateReadingTime(featured.markdown || '')} min read
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-stone-100 group-hover:text-teal-300 transition-colors">
                  {featured.title}
                </h2>
                {featured.summary && (
                  <p className="text-stone-300 line-clamp-2">{featured.summary}</p>
                )}
                <div className="flex items-center justify-between pt-2">
                  <time className="text-sm text-stone-500">
                    {formatDate(featured.publishedAt?.toDate() || featured.createdAt.toDate())}
                  </time>
                  {featured.tags && featured.tags.length > 0 && (
                    <div className="flex gap-2">
                      {featured.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs text-stone-500">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </motion.section>
      )}

      {/* Rest of Posts */}
      {rest.length > 0 && (
        <section aria-label="All posts">
          <h2 className="text-sm font-medium text-stone-400 uppercase tracking-wider mb-4">
            All Posts
          </h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post: BlogPost, i: number) => (
              <motion.li
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
              >
                <PostCard post={post} />
              </motion.li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function PostCard({ post }: { post: BlogPost }) {
  const readingTime = estimateReadingTime(post.markdown || '')
  const date = post.publishedAt?.toDate() || post.createdAt.toDate()

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block card overflow-hidden h-full no-underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-teal-500/60"
    >
      {post.coverImage ? (
        <div className="relative h-40 overflow-hidden">
          <img
            src={post.coverImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="h-24 bg-gradient-to-br from-teal-500/10 to-cyan-500/5 flex items-center justify-center">
          <span className="text-3xl text-teal-400/20">✦</span>
        </div>
      )}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <time>{formatDateShort(date)}</time>
          <span>•</span>
          <span>{readingTime} min</span>
        </div>
        <h3 className="font-semibold text-stone-100 group-hover:text-teal-300 transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.summary && (
          <p className="text-sm text-stone-400 line-clamp-2">{post.summary}</p>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-stone-500 border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}
