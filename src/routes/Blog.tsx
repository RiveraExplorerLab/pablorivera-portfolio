import { posts } from '../data/posts'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Blog() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="text-neutral-300">Notes, ideas, and progress logs.</p>
      </header>

      <ul className="space-y-6">
        {posts.map((post, i) => (
          <motion.li
            key={post.slug}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: i * 0.03 }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className="block rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 hover:bg-neutral-900/60 transition"
            >
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <time className="block text-xs text-neutral-500 mt-1">
                {new Date(post.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <p className="mt-2 text-sm text-neutral-300">{post.summary}</p>
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}