// src/router.tsx
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './routes/RootLayout'
import Home from './routes/Home'
import About from './routes/About'
import Projects from './routes/Projects'
import Stack from './routes/Stack'
import Blog from './routes/Blog'
import Post from './routes/Post'
import Community from './routes/Community'

// Optional: simple 404 page
function NotFound() {
  return <div className="text-sm text-neutral-300">Not found. <a className="underline" href="/">Go home</a></div>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },             // "/" goes to Home
      { path: 'about', element: <About /> },
      { path: 'projects', element: <Projects /> },
      { path: 'stack', element: <Stack /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <Post /> },      // dynamic blog post
      { path: 'community', element: <Community /> },
    ],
  },
])