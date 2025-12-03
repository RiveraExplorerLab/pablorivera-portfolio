// src/components/ProjectCard.tsx
import { motion } from 'framer-motion'
import { useState } from 'react'
import Modal from './Modal'

// Match your Firestore document structure
type Project = {
  id: string
  slug: string
  name: string
  one_liner?: string | null
  cover_url?: string | null
  links?: { live?: string | null; repo?: string | null } | null
  details_md?: string | null
  tags?: string[] | null
}

type Props = { project: Project; index?: number }

export default function ProjectCard({ project, index = 0 }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="card p-4 md:p-5 group"
    >
      <div className="flex items-start gap-4">
        {/* Image with consistent treatment */}
        {project.links?.live ? (
          <a
            href={project.links.live ?? undefined}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.name} live site`}
            className="img-container img-glow img-border-glow aspect-square w-20 shrink-0"
          >
            {project.cover_url ? (
              <img
                src={project.cover_url}
                alt={`${project.name} cover`}
                loading="lazy"
                width={80}
                height={80}
              />
            ) : (
              <div className="img-placeholder w-full h-full">
                <span className="img-placeholder-icon">✦</span>
              </div>
            )}
          </a>
        ) : (
          <div className="img-container img-glow img-border-glow aspect-square w-20 shrink-0">
            {project.cover_url ? (
              <img
                src={project.cover_url}
                alt={`${project.name} cover`}
                loading="lazy"
                width={80}
                height={80}
              />
            ) : (
              <div className="img-placeholder w-full h-full">
                <span className="img-placeholder-icon">✦</span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold leading-tight text-[#e8e6f0] group-hover:text-[#f0b429] transition-colors">
            {project.name}
          </h3>
          {project.one_liner && (
            <p className="mt-1 text-sm text-[#9d99a9]">{project.one_liner}</p>
          )}

          {/* Tags */}
          {!!project.tags?.length && (
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tags.map((t: string) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-[#9d99a9]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex gap-3 text-sm">
            {project.links?.live && (
              <a 
                className="text-[#f0b429] hover:text-[#fbbf24] transition-colors" 
                href={project.links.live} 
                target="_blank" 
                rel="noreferrer"
              >
                Live →
              </a>
            )}
            {project.links?.repo && (
              <a 
                className="text-[#9d99a9] hover:text-[#e8e6f0] transition-colors" 
                href={project.links.repo} 
                target="_blank" 
                rel="noreferrer"
              >
                Repo
              </a>
            )}
            <button
              className="text-[#9d99a9] hover:text-[#e8e6f0] transition-colors"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-controls={`details-${project.slug}`}
            >
              Details
            </button>
          </div>
        </div>
      </div>

      {/* Modal content */}
      <Modal open={open} onClose={() => setOpen(false)} title={project.name}>
        <div className="space-y-6">
          {project.cover_url && (
            <div className="img-container aspect-video img-border-glow">
              <img
                src={project.cover_url}
                alt=""
                loading="lazy"
              />
            </div>
          )}

          {project.one_liner && <p className="text-[#9d99a9]">{project.one_liner}</p>}

          <section className="space-y-2">
            <h4 className="font-semibold text-[#e8e6f0]">Project details</h4>
            <p className="text-sm text-[#9d99a9]">
              {project.details_md ? 'See README-style details below.' : 'No details yet.'}
            </p>
          </section>

          <div className="flex gap-4 pt-2 text-sm">
            {project.links?.repo && (
              <a 
                className="text-[#9d99a9] hover:text-[#e8e6f0] transition-colors" 
                href={project.links.repo} 
                target="_blank" 
                rel="noreferrer"
              >
                View Repo
              </a>
            )}
            {project.links?.live && (
              <a 
                className="text-[#f0b429] hover:text-[#fbbf24] transition-colors" 
                href={project.links.live} 
                target="_blank" 
                rel="noreferrer"
              >
                Open Live Site →
              </a>
            )}
          </div>
        </div>
      </Modal>
    </motion.article>
  )
}
