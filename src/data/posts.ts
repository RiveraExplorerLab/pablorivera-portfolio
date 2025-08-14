export type Post = {
  slug: string
  title: string
  date: string // YYYY-MM-DD
  summary: string
}

export const posts: Post[] = [
  {
    slug: 'welcome-to-blog',
    title: 'Welcome to the Blog',
    date: '2025-08-13',
    summary: 'A quick note about why I’m writing here and what to expect.',
  }
]