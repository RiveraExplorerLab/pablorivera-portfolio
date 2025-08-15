export type Tool = {
  name: string
  role: string            // 3–7 words: why you use it
  link?: string
  tags?: string[]
}

export type StackGroup = {
  title: string
  tools: Tool[]
}

export const stack: StackGroup[] = [
  {
    title: 'Core Web',
    tools: [
      { name: 'React', role: 'UI composition and state' , link: 'https://react.dev' },
      { name: 'TypeScript', role: 'Safety and clarity' , link: 'https://www.typescriptlang.org/' },
      { name: 'Vite', role: 'Fast dev + build' , link: 'https://vitejs.dev' },
      { name: 'Tailwind CSS', role: 'Design in the markup' , link: 'https://tailwindcss.com' },
      { name: 'Framer Motion', role: 'Tiny, tasteful motion' , link: 'https://www.framer.com/motion/' },
    ]
  },
  {
    title: 'Productivity',
    tools: [
      { name: 'VS Code', role: 'Editor + Extensions', link: 'https://code.visualstudio.com/' },
      { name: 'Raycast', role: 'Quicker nav + scripts', link: 'https://www.raycast.com/' },
      { name: 'Figma', role: 'Quick wireframes', link: 'https://www.figma.com/' },
    ]
  },
  {
    title: 'Data & Backend (when needed)',
    tools: [
      { name: 'Supabase', role: 'Auth + DB + storage', link: 'https://supabase.com/' },
      { name: 'Render', role: 'Free static deploys', link: 'https://render.com' },
    ]
  },
  {
    title: 'Power Platform',
    tools: [
      { name: 'Power Apps', role: 'Rapid internal apps' , link: 'https://powerapps.microsoft.com/' },
      { name: 'Power Automate', role: 'Workflow automation' , link: 'https://powerautomate.microsoft.com/' },
    ]
  }
]