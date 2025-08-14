import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  useLockBodyScroll(open)

  // Focus management
  const firstFocusRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    firstFocusRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      prev?.focus()
    }
  }, [open, onClose])

return createPortal(
    <AnimatePresence>
      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Panel (height-limited) */}
          <motion.div
            className="relative mx-auto my-10 w-[min(92vw,720px)] rounded-xl border border-neutral-800
                       bg-neutral-900 shadow-xl flex flex-col max-h-[85vh]"  // <-- limit height
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            {/* Sticky header */}
            <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-neutral-800 sticky top-0 bg-neutral-900">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button
                ref={firstFocusRef}
                onClick={onClose}
                className="rounded px-2 py-1 text-sm text-neutral-300 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Scrollable body */}
            <div className="px-5 py-4 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )

}