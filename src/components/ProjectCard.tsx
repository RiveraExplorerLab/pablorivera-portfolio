// src/components/ProjectCard.tsx
import { motion } from 'framer-motion'
import { useState } from 'react'
import Modal from './Modal'

// Match your Supabase table columns
type Project = {
  id: string
  slug: string
  name: string
  one_liner?: string | null
  cover_url?: string | null
  links?: { live?: string | null; repo?: string | null } | null
  details_md?: string | null
  tags?: string[] | null // optional; include only if you added this column
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
      className="rounded-xl border border-stone-800 bg-stone-900/40 p-4 md:p-5"
    >
      <div className="flex items-start gap-4">
        {/* Image: clickable → live site if exists */}
        {project.links?.live ? (
          <motion.a
            href={project.links.live ?? undefined}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.name} live site`}
            className="size-20 shrink-0 rounded-md overflow-hidden bg-stone-800 block"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {project.cover_url && (
              <img
                src={project.cover_url}
                alt={`${project.name} cover`}
                className="size-full object-cover"
                loading="lazy"
                width={80}
                height={80}
              />
            )}
          </motion.a>
        ) : (
          <motion.div
            className="size-20 shrink-0 rounded-md overflow-hidden bg-stone-800"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {project.cover_url && (
              <img
                src={project.cover_url}
                alt={`${project.name} cover`}
                className="size-full object-cover"
                loading="lazy"
                width={80}
                height={80}
              />
            )}
          </motion.div>
        )}

        {/* Content */}
        <div className="min-w-0">
          <h3 className="text-lg font-semibold leading-tight">{project.name}</h3>
          {project.one_liner && (
            <p className="mt-1 text-sm text-stone-300">{project.one_liner}</p>
          )}

          {/* Tags (optional) */}
          {!!project.tags?.length && (
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tags.map((t: string) => (
                <span
                  key={t}
                  className="rounded-full border border-stone-700 px-2 py-0.5 text-xs text-stone-300"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex gap-3 text-sm">
            {project.links?.live && (
              <a className="underline" href={project.links.live} target="_blank" rel="noreferrer">
                Live
              </a>
            )}
            {project.links?.repo && (
              <a className="underline" href={project.links.repo} target="_blank" rel="noreferrer">
                Repo
              </a>
            )}
            <button
              className="underline"
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
            <img
              src={project.cover_url}
              alt=""
              className="w-full max-h-72 object-cover rounded-md"
              loading="lazy"
            />
          )}

          {project.one_liner && <p className="text-stone-300">{project.one_liner}</p>}

          {/* Replace with your real sections or rendered Markdown if you want */}
          <section className="space-y-2">
            <h4 className="font-semibold">Project details</h4>
            <p className="text-sm text-stone-300">
              {project.details_md ? 'See README-style details below.' : 'No details yet.'}
            </p>
          </section>

          <div className="flex gap-4 pt-2 text-sm">
            {project.links?.repo && (
              <a className="underline" href={project.links.repo} target="_blank" rel="noreferrer">
                View Repo
              </a>
            )}
            {project.links?.live && (
              <a className="underline" href={project.links.live} target="_blank" rel="noreferrer">
                Open Live Site
              </a>
            )}
          </div>
        </div>
      </Modal>
    </motion.article>
  )
}