import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePosts } from '../lib/useSupabase'

export default function Blog() {
  const { data: posts, loading, error } = usePosts(30)

  if (loading) return <p className="text-stone-400 text-sm">Loading…</p>
  if (error)   return <p className="text-rose-400 text-sm">Error: {error}</p>
  if (!posts?.length) return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/40 p-6">
      <p className="text-stone-300">Nothing here yet.</p>
      <div className="mt-3 text-sm">
        <Link to="/projects" className="underline decoration-emerald-500/50 underline-offset-4 hover:decoration-emerald-400">
          In the meantime, see projects
        </Link>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-100 flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-emerald-400" />
          Blog
        </h1>
        <p className="text-stone-300">Notes, ideas, and progress logs.</p>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {posts.map((post: any, i: number) => (
    <motion.li
      key={post.slug}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2, delay: i * 0.03 }}
    >
      <Link
        to={`/blog/${post.slug}`}
        className="group block rounded-xl border border-stone-800 bg-stone-900/40 hover:bg-stone-900/60 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
      >
        {post.cover_url && (
          <img
            src={post.cover_url}
            alt=""
            className="w-full h-40 md:h-44 object-cover rounded-t-xl ring-1 ring-stone-800"
            loading="lazy"
          />
        )}
        <div className="p-5">
          <h2 className="text-lg md:text-xl font-semibold text-stone-100 group-hover:underline group-hover:decoration-emerald-500/50 group-hover:underline-offset-4">
            {post.title}
          </h2>
          <div className="mt-1 text-xs text-stone-400">
            {new Date(post.published_at || post.created_at).toLocaleDateString(undefined, {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
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