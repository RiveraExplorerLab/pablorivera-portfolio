import { useParams } from 'react-router-dom'
import { posts } from '../data/posts'

export default function Post() {
  const { slug } = useParams<{ slug: string }>()
  const post = posts.find(p => p.slug === slug)

  if (!post) {
    return <p className="text-neutral-400">Post not found.</p>
  }

  // Eventually: load from MDX
  return (
    <article className="prose prose-invert max-w-none">
      <h1>{post.title}</h1>
      <time className="text-sm text-neutral-500">
        {new Date(post.date).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </time>
      <p className="mt-4">{post.summary}</p>
      <p className="mt-4">Full post content will go here. Later we can wire MDX.</p>
    </article>
  )
}