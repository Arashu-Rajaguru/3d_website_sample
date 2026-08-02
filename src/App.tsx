import { useState, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { motion, AnimatePresence } from 'framer-motion'
import { ThreeCanvas } from './components/ThreeCanvas'
import { Header } from './components/Header'
import { Dashboard } from './components/Dashboard'
import { SectionDetail } from './components/SectionDetail'
import { Linkedin, Instagram, Github } from 'lucide-react'

// Web Audio API Synthesizer for cosmic ambient drone
class SpaceSynthesizer {
  private ctx: AudioContext | null = null
  private osc: OscillatorNode | null = null
  private gain: GainNode | null = null
  private filter: BiquadFilterNode | null = null
  private active: boolean = false

  start() {
    if (this.active) return
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      this.ctx = new AudioContextClass()
      
      // Cosmic drone oscillator
      this.osc = this.ctx.createOscillator()
      this.osc.type = 'sawtooth'
      this.osc.frequency.setValueAtTime(55, this.ctx.currentTime) // Low hum A1 note
      
      this.filter = this.ctx.createBiquadFilter()
      this.filter.type = 'lowpass'
      this.filter.frequency.setValueAtTime(140, this.ctx.currentTime) // Muffle high freqs
      
      this.gain = this.ctx.createGain()
      this.gain.gain.setValueAtTime(0.06, this.ctx.currentTime) // Low ambient volume
      
      this.osc.connect(this.filter)
      this.filter.connect(this.gain)
      this.gain.connect(this.ctx.destination)
      
      this.osc.start()
      this.active = true
    } catch (e) {
      console.warn("Failed to start AudioContext:", e)
    }
  }

  stop() {
    if (!this.active) return
    try {
      if (this.osc) {
        this.osc.stop()
        this.osc = null
      }
      if (this.ctx) {
        this.ctx.close()
        this.ctx = null
      }
      this.active = false
    } catch (e) {
      console.warn("Failed to stop AudioContext:", e)
    }
  }
}

const synth = new SpaceSynthesizer()

export default function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [zoomedSection, setZoomedSection] = useState<string | null>(null)
  const [showDashboard, setShowDashboard] = useState(false)
  const [soundMuted, setSoundMuted] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const lenisRef = useRef<Lenis | null>(null)

  // Audio Toggle
  useEffect(() => {
    if (soundMuted) {
      synth.stop()
    } else {
      synth.start()
    }
    return () => synth.stop()
  }, [soundMuted])

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  // Observe scroll position to trigger camera flight coordinates
  useEffect(() => {
    const sections = ['home', 'about', 'journey', 'events', 'domains', 'projects', 'community', 'family', 'join', 'contact']
    
    const handleScroll = () => {
      if (zoomedSection || showDashboard) return
      
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      const maxScroll = docHeight - windowHeight

      if (maxScroll <= 0) return

      const progress = scrollY / maxScroll
      setScrollProgress(progress)
      
      // Map progress to active section segment
      const idx = Math.min(Math.floor(progress * sections.length), sections.length - 1)
      setActiveSection(sections[idx])
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [zoomedSection, showDashboard])

  // Fast-travel utility helper
  const navigateToSection = (secId: string) => {
    setZoomedSection(null)
    setShowDashboard(false)
    setActiveSection(secId)

    const el = document.getElementById(`section-${secId}`)
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: 0, immediate: false, duration: 1.5 })
    }
  }

  // Handle zooming directly into a specific 3D mesh
  const handleZoomSection = (secId: string) => {
    setZoomedSection(secId)
    setActiveSection(secId)
    // Temporarily pause scroll
    if (lenisRef.current) {
      lenisRef.current.stop()
    }
  }

  const handleCloseZoom = () => {
    setZoomedSection(null)
    // Resume scroll
    if (lenisRef.current) {
      lenisRef.current.start()
    }
  }

  return (
    <div className="relative text-white min-h-screen select-none font-sans overflow-hidden">
      
      {/* 3D WebGL Background Layer */}
      <ThreeCanvas 
        activeSection={zoomedSection || (showDashboard ? 'overview' : activeSection)} 
        scrollProgress={scrollProgress}
        isLocked={zoomedSection !== null || showDashboard}
        onIslandClick={handleZoomSection}
      />

      {/* Sleek Floating Header */}
      <Header 
        activeSection={zoomedSection || (showDashboard ? 'overview' : activeSection)} 
        setActiveSection={(sec) => {
          if (sec === 'overview') {
            setShowDashboard(true)
            setZoomedSection(null)
          } else {
            navigateToSection(sec)
          }
        }}
        soundMuted={soundMuted}
        setSoundMuted={setSoundMuted}
      />

      {/* Command Center Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setShowDashboard(!showDashboard)
            setZoomedSection(null)
            if (lenisRef.current) {
              if (!showDashboard) {
                lenisRef.current.stop()
              } else {
                lenisRef.current.start()
              }
            }
          }}
          className="relative px-5 py-2.5 rounded-lg border border-brand-accent/50 text-brand-accent font-display text-xs font-bold uppercase tracking-wider bg-brand-bg/90 backdrop-blur-md hover:bg-brand-accent/10 transition-all shadow-[0_0_15px_rgba(125,249,255,0.25)] hover:scale-105"
        >
          {showDashboard ? "Exit Command Center" : "Command Center"}
        </button>
      </div>

      {/* Render Overview Dashboard Grid (Matches the concept image) */}
      <AnimatePresence>
        {showDashboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 w-full min-h-screen bg-black/40 backdrop-blur-sm z-30 pt-10"
          >
            <Dashboard 
              setActiveSection={setActiveSection}
              onZoomSection={handleZoomSection}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render Focused Close-Up Overlay panels */}
      <AnimatePresence>
        {zoomedSection && (
          <SectionDetail activeSection={zoomedSection} onClose={handleCloseZoom} />
        )}
      </AnimatePresence>

      {/* Render Scrollable Webpage Content (Normal view) */}
      {!showDashboard && !zoomedSection && (
        <div className="relative z-10">
          
          {/* 01. HERO */}
          <section id="section-home" className="min-h-screen flex items-center justify-start px-6 md:px-16 lg:px-24">
            <div className="max-w-2xl text-left bg-black/10 backdrop-blur-xxs p-6 rounded-xl">
              <span className="px-2 py-0.5 font-mono text-[10px] tracking-widest text-brand-accent border border-brand-accent/30 rounded bg-brand-surface uppercase">SYSTEM_01 // HERO</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white mt-4 leading-tight tracking-tight select-none">
                Building the <span className="clip-text-g">Future</span> <br />
                of Technology
              </h2>
              <p className="mt-3 text-brand-muted text-xs md:text-sm font-sans max-w-lg leading-relaxed">
                GDG on Campus – R.M.K. Engineering College is a student-led technology community empowering builders to learn, develop, and collaborate.
              </p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => handleZoomSection('join')} className="px-5 py-2 rounded bg-google-blue hover:bg-google-blue/80 text-white text-[10px] font-bold uppercase tracking-wider transition-all">Join Community</button>
                <button onClick={() => navigateToSection('about')} className="px-4 py-2 rounded border border-brand-border text-white text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-white/5">Learn More</button>
              </div>
            </div>
          </section>

          {/* 02. ABOUT */}
          <section id="section-about" className="min-h-screen flex items-center justify-start px-6 md:px-16 lg:px-24">
            <div className="max-w-md glass-panel p-6 md:p-8 rounded-2xl glow-cyan">
              <span className="px-2 py-0.5 font-mono text-[10px] tracking-widest text-google-red border border-google-red/30 rounded bg-brand-surface uppercase">SYSTEM_02 // ABOUT</span>
              <h3 className="text-2xl font-display font-bold text-white mt-4">Who We Are</h3>
              <p className="text-brand-muted text-xs leading-relaxed mt-2">
                GDG on Campus RMKEC is a student-driven technology community focused on fostering innovation, technical excellence, and collaborative learning.
              </p>
              <div className="mt-5 space-y-3 pt-4 border-t border-brand-border/40 text-xs">
                <div>
                  <h4 className="font-bold text-google-blue font-display uppercase tracking-wider text-[10px]">Our Mission</h4>
                  <p className="text-[11px] text-brand-muted mt-0.5">Promote technical learning and build solutions for the college ecosystem.</p>
                </div>
                <div>
                  <h4 className="font-bold text-google-green font-display uppercase tracking-wider text-[10px]">Our Vision</h4>
                  <p className="text-[11px] text-brand-muted mt-0.5">To be a leading student tech community recognized for innovation and meaningful impact.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 03. JOURNEY */}
          <section id="section-journey" className="min-h-screen flex items-center justify-end px-6 md:px-16 lg:px-24">
            <div className="max-w-md glass-panel p-6 md:p-8 rounded-2xl glow-cyan">
              <span className="px-2 py-0.5 font-mono text-[10px] tracking-widest text-google-yellow border border-google-yellow/30 rounded bg-brand-surface uppercase">SYSTEM_03 // JOURNEY</span>
              <h3 className="text-2xl font-display font-bold text-white mt-4 mb-4">Our Journey</h3>
              <div className="pl-4 border-l border-brand-border space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-white font-mono">2025: The Beginning</h4>
                  <p className="text-[11px] text-brand-muted">Chapter established in September 2025 with a vision to build technology.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white font-mono">Events & Growth</h4>
                  <p className="text-[11px] text-brand-muted">Cloud study jams, hands-on workshops, and certifications.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white font-mono">Building Impact</h4>
                  <p className="text-[11px] text-brand-muted">Developed college utility software and incubated student projects.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 04. EVENTS */}
          <section id="section-events" className="min-h-screen flex items-center justify-start px-6 md:px-16 lg:px-24">
            <div className="max-w-lg glass-panel p-6 md:p-8 rounded-2xl glow-cyan">
              <span className="px-2 py-0.5 font-mono text-[10px] tracking-widest text-google-green border border-google-green/30 rounded bg-brand-surface uppercase">SYSTEM_04 // EVENTS</span>
              <h3 className="text-2xl font-display font-bold text-white mt-4 mb-2">Event Arena</h3>
              <p className="text-brand-muted text-xs mb-4">Explore engineering campaigns organized by our chapter.</p>
              
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-brand-surface/40 rounded border border-brand-border/40">
                  <div className="flex justify-between font-bold text-white font-display">
                    <span>Google Cloud Study Jam</span>
                    <span className="text-google-blue font-mono">Oct 2025</span>
                  </div>
                  <p className="text-[11px] text-brand-muted mt-1">100+ participants, 40+ pathway milestone completers. Rewards distributed by the Principal.</p>
                </div>
                <div className="p-3 bg-brand-surface/40 rounded border border-brand-border/40">
                  <div className="flex justify-between font-bold text-white font-display">
                    <span>HackNEXA'26 Hackathon</span>
                    <span className="text-google-red font-mono">Upcoming</span>
                  </div>
                  <p className="text-[11px] text-brand-muted mt-1">Largest hackathon in RMK group, expecting 650+ participating developer teams.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 05. TECH DOMAINS */}
          <section id="section-domains" className="min-h-screen flex items-center justify-center px-6">
            <div className="max-w-xl glass-panel p-6 md:p-8 rounded-2xl text-center glow-purple">
              <span className="px-2 py-0.5 font-mono text-[10px] tracking-widest text-[#a855f7] border border-[#a855f7]/30 rounded bg-brand-surface uppercase">SYSTEM_05 // DOMAINS</span>
              <h3 className="text-2xl font-display font-bold text-white mt-4">Technology Domains</h3>
              <p className="text-brand-muted text-xs mt-2 mb-6">Explore the tech divisions operating in our innovation campus.</p>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {['Web', 'AI', 'Cloud', 'Android', 'Cybersecurity', 'UI/UX', 'Backend'].map((dom) => (
                  <button
                    key={dom}
                    onClick={() => {
                      handleZoomSection('domains')
                    }}
                    className="px-3.5 py-1.5 rounded-lg border border-brand-border/60 hover:border-brand-accent text-white text-xs font-mono uppercase bg-brand-surface/40 transition-all hover:-translate-y-0.5"
                  >
                    {dom}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* 06. PROJECTS */}
          <section id="section-projects" className="min-h-screen flex items-center justify-start px-6 md:px-16 lg:px-24">
            <div className="max-w-md glass-panel p-6 md:p-8 rounded-2xl glow-cyan">
              <span className="px-2 py-0.5 font-mono text-[10px] tracking-widest text-google-blue border border-google-blue/30 rounded bg-brand-surface uppercase">SYSTEM_06 // PROJECTS</span>
              <h3 className="text-2xl font-display font-bold text-white mt-4">Real-Time Bus Tracker</h3>
              <p className="text-brand-muted text-xs leading-relaxed mt-2">
                A software solution designed to provide real-time bus tracking and travel schedules optimization for students and administration.
              </p>
              <div className="flex gap-2 mt-5 pt-4 border-t border-brand-border/40">
                <button onClick={() => handleZoomSection('projects')} className="flex-1 py-2 rounded bg-google-blue hover:bg-google-blue/80 text-white text-[10px] font-bold uppercase transition-all">Launch Demo</button>
                <a href="#github" className="flex-1 py-2 rounded border border-brand-border text-center text-white text-[10px] font-bold uppercase transition-all hover:bg-white/5">Source Code</a>
              </div>
            </div>
          </section>

          {/* 07. COMMUNITY STRUCTURE */}
          <section id="section-community" className="min-h-screen flex items-center justify-end px-6 md:px-16 lg:px-24">
            <div className="max-w-md glass-panel p-6 md:p-8 rounded-2xl glow-cyan">
              <span className="px-2 py-0.5 font-mono text-[10px] tracking-widest text-brand-accent border border-brand-accent/30 rounded bg-brand-surface uppercase">SYSTEM_07 // STRUCTURE</span>
              <h3 className="text-2xl font-display font-bold text-white mt-4">Community Structure</h3>
              <p className="text-brand-muted text-xs leading-relaxed mt-2 mb-4">
                Our team is split into distinct operations nodes to coordinate events, design interfaces, and compile codebases.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-brand-border/40 text-[10px] font-mono">
                <div>
                  <span className="block text-google-red font-bold uppercase mb-1">Core Team</span>
                  <ul className="text-brand-muted space-y-1 text-[11px]">
                    <li>• Tech Operations</li>
                    <li>• PR & Marketing</li>
                    <li>• HR Management</li>
                  </ul>
                </div>
                <div>
                  <span className="block text-brand-accent font-bold uppercase mb-1">Tech Wings</span>
                  <ul className="text-brand-muted space-y-1 text-[11px]">
                    <li>• AI/ML Systems</li>
                    <li>• Backend & Cloud</li>
                    <li>• UI/UX Design</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 08. FAMILY WALL */}
          <section id="section-family" className="min-h-screen flex items-center justify-start px-6 md:px-16 lg:px-24">
            <div className="max-w-md glass-panel p-6 md:p-8 rounded-2xl glow-cyan">
              <span className="px-2 py-0.5 font-mono text-[10px] tracking-widest text-google-yellow border border-google-yellow/30 rounded bg-brand-surface uppercase">SYSTEM_08 // WALL</span>
              <h3 className="text-2xl font-display font-bold text-white mt-4">Meet Our Family</h3>
              <p className="text-brand-muted text-xs leading-relaxed mt-2 mb-4">
                Passionate students driving operations, design frameworks, and building software solutions on campus.
              </p>
              <button onClick={() => handleZoomSection('family')} className="w-full py-2.5 rounded border border-brand-border text-xs font-semibold text-white uppercase tracking-wider bg-brand-surface/20 transition-all hover:bg-brand-surface">
                View Profile Gallery
              </button>
            </div>
          </section>

          {/* 09. JOIN US */}
          <section id="section-join" className="min-h-screen flex items-center justify-center px-6">
            <div className="max-w-md glass-panel p-6 md:p-8 rounded-2xl text-center glow-cyan">
              <span className="px-2 py-0.5 font-mono text-[10px] tracking-widest text-brand-accent border border-brand-accent/30 rounded bg-brand-surface uppercase">SYSTEM_09 // PORTAL</span>
              <h3 className="text-3xl font-display font-bold text-white mt-4">Become a Part of It</h3>
              <p className="text-brand-muted text-xs leading-relaxed mt-2 mb-5">
                Submit details into our digital community catalog to unlock event check-ins and campaigns.
              </p>
              <button 
                onClick={() => handleZoomSection('join')}
                className="px-6 py-3 rounded-lg border-2 border-brand-accent/40 text-brand-accent text-xs font-bold uppercase tracking-widest bg-brand-surface hover:bg-brand-accent/10 transition-all pulse-portal"
              >
                Access Join Portal
              </button>
            </div>
          </section>

          {/* 10. CONTACT */}
          <section id="section-contact" className="min-h-screen flex items-center justify-start px-6 md:px-16 lg:px-24">
            <div className="max-w-md glass-panel p-6 md:p-8 rounded-2xl glow-purple">
              <span className="px-2 py-0.5 font-mono text-[10px] tracking-widest text-[#a855f7] border border-[#a855f7]/30 rounded bg-brand-surface uppercase">SYSTEM_10 // CONTACT</span>
              <h3 className="text-2xl font-display font-bold text-white mt-4 mb-2">Get in Touch</h3>
              <p className="text-brand-muted text-xs leading-relaxed mb-4">Initialize communication links to the RMKEC chapter admin network.</p>
              
              <div className="space-y-2 text-[10px] font-mono pt-4 border-t border-brand-border/40">
                <div className="flex justify-between py-1.5 text-brand-muted">
                  <span>General Email</span>
                  <a href="mailto:gdg@rmkec.ac.in" className="text-brand-accent hover:underline font-bold">gdg@rmkec.ac.in</a>
                </div>
                <div className="flex justify-between py-1.5 text-brand-muted">
                  <span>Admissions Admin</span>
                  <a href="https://rmkec.ac.in" target="_blank" rel="noreferrer" className="text-brand-accent hover:underline font-bold">rmkec.ac.in</a>
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-12 border-t border-brand-border/40 bg-[#050816] relative z-10 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <span className="font-display font-bold text-sm tracking-wider text-white">GDG on Campus RMKEC</span>
                <p className="text-[11px] text-brand-muted mt-1">Empowering students to build impactful solutions for the college ecosystem.</p>
              </div>
              <div className="flex items-center gap-4 text-brand-muted hover:text-white transition-colors">
                <a href="#linkedin"><Linkedin size={16} /></a>
                <a href="#instagram"><Instagram size={16} /></a>
                <a href="#github"><Github size={16} /></a>
              </div>
              <div className="text-center md:text-right font-mono text-[10px] text-brand-muted">
                <span>Made with ♥ by the GDG RMKEC Team</span>
                <span className="block mt-1">© 2026 GDG RMKEC. All Rights Reserved.</span>
              </div>
            </div>
          </footer>

        </div>
      )}

    </div>
  )
}
