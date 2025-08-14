import { motion } from 'framer-motion'
import type { Project } from '../data/projects'
import { useState } from 'react'
import Modal from './Modal'

type Props = { project: Project; index?: number }

export default function ProjectCard({ project, index = 0 }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 md:p-5"
    >
      <div className="flex items-start gap-4">
        {/* Image: clickable → live site if exists */}
        {project.links?.live ? (
          <motion.a
            href={project.links.live}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.name} live site`}
            className="size-20 shrink-0 rounded-md overflow-hidden bg-neutral-800 block"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {project.cover && (
              <img
                src={project.cover}
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
            className="size-20 shrink-0 rounded-md overflow-hidden bg-neutral-800"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {project.cover && (
              <img
                src={project.cover}
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
          <p className="mt-1 text-sm text-neutral-300">{project.oneLiner}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-neutral-700 px-2 py-0.5 text-xs text-neutral-300"
              >
                {t}
              </span>
            ))}
          </div>

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
    {project.cover && (
      <img
        src={project.cover}
        alt=""
        className="w-full max-h-72 object-cover rounded-md"
        loading="lazy"
      />
    )}

    <p className="text-neutral-300">{project.oneLiner}</p>

    <section className="space-y-2">
      <h4 className="font-semibold">Goal</h4>
      <p className="text-sm text-neutral-300">
        What I wanted to build and why it matters. (Add real copy.)
      </p>
    </section>

    <section className="space-y-2">
      <h4 className="font-semibold">Challenges</h4>
      <p className="text-sm text-neutral-300">
        A tricky problem and how I solved it. (Add real copy.)
      </p>
    </section>

    <section className="space-y-2">
      <h4 className="font-semibold">Learnings</h4>
      <p className="text-sm text-neutral-300">
        A takeaway I’d apply to future work. (Add real copy.)
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