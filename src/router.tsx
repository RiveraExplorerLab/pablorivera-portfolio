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
import Login from './routes/Login'
import Admin from './routes/Admin'
import AdminCommunity from './routes/AdminCommunity'
import AdminAccess from './routes/AdminAccess'
import ProjectDetail from './routes/ProjectDetail'
import NotFound from './routes/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'projects', element: <Projects /> },
      { path: 'projects/:slug', element: <ProjectDetail /> },
      { path: 'stack', element: <Stack /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <Post /> },
      { path: 'community', element: <Community /> },
      { path: 'login', element: <Login /> },
      { path: 'admin', element: <Admin /> },
      { path: 'admin/community', element: <AdminCommunity /> },
      { path: 'admin/access', element: <AdminAccess /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
