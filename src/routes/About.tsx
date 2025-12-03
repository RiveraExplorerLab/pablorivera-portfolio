// src/routes/About.tsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import SEO from '../components/SEO'

const currentlyInto = [
  "obsessing over micro-interactions",
  "wondering if this button needs more padding",
  "reading about systems design at 1am",
  "probably refactoring something that works fine",
  "deciding if dark mode is dark enough",
]

export default function About() {
  const [currentlyIndex, setCurrentlyIndex] = useState(0)
  const cycleCurrently = () => setCurrentlyIndex(i => (i + 1) % currentlyInto.length)

  return (
    <>
      <SEO 
        title="About" 
        description="Learn about Pablo Rivera — developer, systems thinker, and professional overthinker. Based in Arizona, building thoughtful software."
      />
      <div className="space-y-20">
      {/* HERO */}
      <section className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row gap-8 items-start"
        >
          {/* Headshot */}
          <div className="relative shrink-0">
            <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
              <img
                src="/images/headshot.webp"
                alt="Pablo Rivera"
                className="w-full h-full object-cover object-top grayscale-[15%] hover:grayscale-0 transition-all duration-500"
              />
            </div>
            {/* Fun status indicator */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#1e1b26]/90 backdrop-blur-sm border border-white/10 text-xs flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[#9d99a9]">Available</span>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#e8e6f0]">
                Hey, I'm Pablo 👋
              </h1>
              <p className="text-[#9d99a9] mt-2">
                Developer · Systems Thinker · Professional Overthinker
              </p>
            </div>
            
            <p className="text-xl text-[#9d99a9] max-w-xl leading-relaxed">
              I build things that make life{' '}
              <span className="text-[#f0b429]">clearer</span>,{' '}
              <span className="text-[#f0b429]">easier</span>, and occasionally{' '}
              <span className="text-[#f0b429]">magical</span>. 
              Based in Arizona, where the sunsets are better than any color palette I could design.
            </p>

            {/* Currently */}
            <button 
              onClick={cycleCurrently}
              className="text-sm text-[#9d99a9]/70 hover:text-[#9d99a9] transition-colors text-left"
            >
              <span className="text-[#f0b429]">Currently:</span> {currentlyInto[currentlyIndex]}
            </button>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/projects" className="btn-primary">
                See my work
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a href="mailto:hello@pablorivera.dev" className="btn-secondary">
                Say hello
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* THE REAL STORY */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3"
        >
          <span className="text-2xl">📖</span>
          <h2 className="text-xl font-semibold text-[#e8e6f0]">The actual story</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card p-6 md:p-8 space-y-4 max-w-2xl"
        >
          <p className="text-[#9d99a9] leading-relaxed">
            I didn't start as a developer. I started as the person who wondered "why is this process so complicated?" enough times that someone eventually said "well, why don't you fix it?"
          </p>
          <p className="text-[#9d99a9] leading-relaxed">
            So I did. First with Power Platform (don't judge), then with actual code. Turned out I had a knack for turning messy, paper-based workflows into apps that people actually wanted to use.
          </p>
          <p className="text-[#9d99a9] leading-relaxed">
            Now I spend my time deep in <span className="text-[#e8e6f0]">React</span>, <span className="text-[#e8e6f0]">TypeScript</span>, and <span className="text-[#e8e6f0]">Firebase</span> — building tools that feel thoughtful. The kind where you think "oh, that's nice" instead of "where's the button?"
          </p>
          <p className="text-[#f0b429] font-medium">
            I'm still learning. Always will be. That's the fun part.
          </p>
        </motion.div>
      </section>

      {/* HOW I THINK */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3"
        >
          <span className="text-2xl">🧠</span>
          <h2 className="text-xl font-semibold text-[#e8e6f0]">How my brain works</h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              emoji: "🔬",
              title: "Take it apart",
              desc: "I can't resist understanding how things work under the hood. Then I put them back together... usually better.",
              color: "from-cyan-500/20 to-cyan-600/10",
              border: "hover:border-cyan-500/30"
            },
            {
              emoji: "✨",
              title: "Make it obvious",
              desc: "If someone has to think about your UI, you've already lost. Interfaces should feel inevitable.",
              color: "from-[#f0b429]/20 to-[#fbbf24]/10",
              border: "hover:border-[#f0b429]/30"
            },
            {
              emoji: "🚀",
              title: "Ship it, then learn",
              desc: "Perfect is the enemy of shipped. I'd rather have real feedback than perfect assumptions.",
              color: "from-purple-500/20 to-purple-600/10",
              border: "hover:border-purple-500/30"
            },
          ].map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`card p-6 group transition-colors ${item.border}`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                {item.emoji}
              </div>
              <h3 className="font-semibold text-[#e8e6f0] text-lg">{item.title}</h3>
              <p className="text-[#9d99a9] mt-2 leading-relaxed">{item.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3"
        >
          <span className="text-2xl">📍</span>
          <h2 className="text-xl font-semibold text-[#e8e6f0]">The journey so far</h2>
        </motion.div>

        <div className="grid md:grid-cols-[200px,1fr] gap-8">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-6 space-y-6 h-fit"
          >
            <div>
              <div className="text-3xl font-bold gradient-text">2+</div>
              <div className="text-sm text-[#9d99a9]">Years building</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#e8e6f0]">∞</div>
              <div className="text-sm text-[#9d99a9]">Browser tabs open</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#e8e6f0]">47</div>
              <div className="text-sm text-[#9d99a9]">npm packages later...</div>
            </div>
          </motion.div>

          {/* Timeline */}
          <div className="space-y-1">
            {[
              {
                when: '2025',
                emoji: '🔥',
                what: 'Going deep',
                desc: "Building this portfolio, exploring what's possible when you actually care about the details.",
                active: true
              },
              {
                when: '2023–24',
                emoji: '⚡',
                what: 'Power Platform → Real code',
                desc: 'Turned paper processes into apps. Realized I wanted to build without guardrails.'
              },
              {
                when: 'Before',
                emoji: '🌱',
                what: 'The spark',
                desc: 'Asked "why is this so complicated?" one too many times. Started fixing things.'
              },
            ].map((item, i) => (
              <motion.div
                key={item.when}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="relative pl-8 pb-6 border-l-2 border-white/10 last:pb-0 last:border-transparent"
              >
                <div 
                  className={`absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                    item.active 
                      ? 'bg-gradient-to-r from-[#f0b429] to-[#fbbf24]' 
                      : 'bg-[#2a2633] border border-white/20'
                  }`}
                >
                  {item.active && <span className="absolute w-6 h-6 rounded-full bg-[#f0b429]/30 animate-ping" />}
                </div>
                
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{item.emoji}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    item.active 
                      ? 'bg-[#f0b429]/10 text-[#f0b429]'
                      : 'bg-white/5 text-[#9d99a9]'
                  }`}>
                    {item.when}
                  </span>
                </div>
                <h3 className="font-semibold text-[#e8e6f0]">{item.what}</h3>
                <p className="text-sm text-[#9d99a9] mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BEYOND CODE */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3"
        >
          <span className="text-2xl">🎮</span>
          <h2 className="text-xl font-semibold text-[#e8e6f0]">When I'm not coding</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { emoji: '🎹', label: 'Piano', desc: 'Still learning Clair de Lune' },
            { emoji: '📸', label: 'Photography', desc: 'Mostly golden hour stuff' },
            { emoji: '🚗', label: 'Old cars', desc: 'They don\'t make \'em like they used to' },
            { emoji: '🍜', label: 'Anime', desc: 'Currently: whatever\'s trending' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="card p-4 text-center hover:border-white/20 transition-colors group"
            >
              <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">{item.emoji}</span>
              <div className="font-medium text-[#e8e6f0]">{item.label}</div>
              <div className="text-xs text-[#9d99a9] mt-1">{item.desc}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card p-6 flex items-center gap-4 max-w-xl"
        >
          <span className="text-4xl">☕</span>
          <div>
            <p className="text-[#9d99a9]">
              <span className="text-[#e8e6f0] font-medium">Hot take:</span> The best code is written after midnight with good music and questionable amounts of caffeine.
            </p>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="card p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f0b429]/5 via-transparent to-purple-500/5" />
        
        <div className="relative z-10">
          <span className="text-4xl mb-4 block">🤝</span>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#e8e6f0]">
            Let's make something cool
          </h2>
          <p className="text-[#9d99a9] mt-3 max-w-lg mx-auto text-lg">
            Got an interesting problem? A wild idea? Or just want to chat about code, cars, or why CSS is simultaneously beautiful and terrible?
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/community" className="btn-primary">
              Join the lab
            </Link>
            <a href="mailto:hello@pablorivera.dev" className="btn-secondary">
              Drop me a line
            </a>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}
