// src/routes/Blog.tsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePosts } from '../hooks/useBlogPosts'
import type { BlogPost } from '../lib/types'

export default function Blog() {
  const { data: posts, loading, error } = usePosts(30)

  if (loading) return <p className="text-stone-400 text-sm">Loading…</p>
  if (error) return <p className="text-rose-400 text-sm">Error: {error}</p>
  if (!posts?.length) return (
    <div className="card p-6">
      <p className="text-stone-300">Nothing here yet.</p>
      <div className="mt-3 text-sm">
        <Link to="/projects" className="text-teal-400 hover:text-teal-300 transition-colors">
          In the meantime, see projects →
        </Link>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-100 flex items-center gap-2">
          Blog
        </h1>
        <p className="text-stone-300">Notes, ideas, and progress logs.</p>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: BlogPost, i: number) => (
          <motion.li
            key={post.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: i * 0.03 }}
            whileHover={{ y: -4, scale: 1.01 }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className="group block card overflow-hidden focus:outline-none focus:ring-2 focus:ring-teal-500/60"
            >
              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt=""
                  className="w-full h-40 md:h-44 object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-5">
                <h2 className="text-lg md:text-xl font-semibold text-stone-100 group-hover:text-teal-300 transition-colors">
                  {post.title}
                </h2>
                <div className="mt-1 text-xs text-teal-400/80">
                  {formatDate(post.publishedAt?.toDate() || post.createdAt.toDate())}
                </div>
                <p className="mt-2 text-sm text-stone-300 line-clamp-2">{post.summary}</p>
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
