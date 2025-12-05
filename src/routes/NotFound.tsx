import { Link, isRouteErrorResponse, useRouteError, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { track } from '../lib/analytics'

const excuses = [
  "The page took a coffee break ☕",
  "This URL went on vacation 🏖️",
  "404: Page not found (it's not you, it's me)",
  "The bits got lost in transmission",
  "This page is in another castle 🏰",
  "Looks like this route took a wrong turn",
  "The page you're looking for is probably debugging itself",
  "Error: Brain.exe has stopped working",
  "This page yeeted itself into the void",
  "Houston, we have a problem 🚀",
]

const suggestions = [
  { to: '/', label: 'Go home', icon: '🏠' },
  { to: '/projects', label: 'See my work', icon: '💼' },
  { to: '/blog', label: 'Read the blog', icon: '📝' },
  { to: '/about', label: 'Learn about me', icon: '👋' },
]

export default function NotFound() {
  const err = useRouteError()
  const location = useLocation()
  const is404 = isRouteErrorResponse(err) && err.status === 404
  const [excuseIndex, setExcuseIndex] = useState(0)
  const [clicks, setClicks] = useState(0)
  const [easterEggTracked, setEasterEggTracked] = useState(false)

  // Track 404 page view
  useEffect(() => {
    track.notFoundPage(location.pathname)
  }, [location.pathname])

  // Rotate excuse on click
  const cycleExcuse = () => {
    setExcuseIndex(i => (i + 1) % excuses.length)
    setClicks(c => c + 1)
  }

  // Easter egg after clicking a lot
  const easterEgg = clicks >= 5

  // Track easter egg discovery
  useEffect(() => {
    if (easterEgg && !easterEggTracked) {
      track.easterEggFound('404_persistence')
      setEasterEggTracked(true)
    }
  }, [easterEgg, easterEggTracked])

  // Random initial excuse
  useEffect(() => {
    setExcuseIndex(Math.floor(Math.random() * excuses.length))
  }, [])

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 max-w-md"
      >
        {/* Glitchy 404 */}
        <motion.div 
          className="relative cursor-pointer select-none"
          onClick={cycleExcuse}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-8xl sm:text-9xl font-bold gradient-text font-heading">
            {is404 ? '404' : 'Oops'}
          </span>
          {/* Glitch layers */}
          <span 
            className="absolute inset-0 text-8xl sm:text-9xl font-bold font-heading text-cyan-400/30"
            style={{ transform: 'translate(-2px, 2px)', mixBlendMode: 'screen' }}
            aria-hidden
          >
            {is404 ? '404' : 'Oops'}
          </span>
          <span 
            className="absolute inset-0 text-8xl sm:text-9xl font-bold font-heading text-[#f0b429]/30"
            style={{ transform: 'translate(2px, -2px)', mixBlendMode: 'screen' }}
            aria-hidden
          >
            {is404 ? '404' : 'Oops'}
          </span>
        </motion.div>

        {/* Excuse text */}
        <motion.p 
          key={excuseIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl text-[#9d99a9] cursor-pointer"
          onClick={cycleExcuse}
        >
          {excuses[excuseIndex]}
        </motion.p>

        {/* Easter egg */}
        {easterEgg && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-[#f0b429]"
          >
            You clicked {clicks} times. I admire your persistence. 🎉
          </motion.p>
        )}

        {/* Click hint */}
        {!easterEgg && (
          <p className="text-xs text-[#9d99a9]/50">
            (click the 404 for more excuses)
          </p>
        )}

        {/* Suggestions */}
        <div className="pt-6 space-y-3">
          <p className="text-sm text-[#9d99a9]">Maybe try one of these instead?</p>
          <div className="flex flex-wrap justify-center gap-3">
            {suggestions.map((s, i) => (
              <motion.div
                key={s.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link 
                  to={s.to} 
                  className="btn-secondary"
                >
                  <span className="mr-2">{s.icon}</span>
                  {s.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ASCII art decoration */}
        <pre className="text-[10px] text-[#9d99a9]/30 mt-8 font-mono hidden sm:block" aria-hidden>
{`
    ¯\\_(ツ)_/¯
`}
        </pre>
      </motion.div>
    </section>
  )
}
