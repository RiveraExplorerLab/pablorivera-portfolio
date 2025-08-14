export type Project = {
  slug: string
  name: string
  oneLiner: string
  role?: string
  year?: string
  tags: string[]
  links?: { live?: string; repo?: string }
  cover?: string // /public path (optional)
}

export const projects: Project[] = [
  {
    slug: 'portfolio',
    name: 'Photography Portfolio',
    oneLiner: 'A Placeholder till projects has been completed.',
    year: '2025',
    tags: ['Adobe'],
    links: { 
      live: 'https://pablomrivera.myportfolio.com/', 
      repo: 'https://github.com/RiveraExplorerLab/pablorivera-portfolio' 
    },
    cover: '/images/SampleImage1.png' 
  },
  {
    slug: 'explorerlab',
    name: 'Explorer Lab',
    oneLiner: 'A website for me to build, experiment, and share my web apps.',
    tags: ['React', 'UI/UX', 'Systems-thinking'],
  },
]