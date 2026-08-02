import { useState, useEffect } from 'react'
import { Volume2, VolumeX, Menu, X } from 'lucide-react'

interface HeaderProps {
  activeSection: string
  setActiveSection: (sec: string) => void
  soundMuted: boolean
  setSoundMuted: (muted: boolean) => void
}

export function Header({ activeSection, setActiveSection, soundMuted, setSoundMuted }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Detect scroll to shrink the navigation bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'journey', label: 'Journey' },
    { id: 'events', label: 'Events' },
    { id: 'projects', label: 'Projects' },
    { id: 'community', label: 'Community' },
    { id: 'family', label: 'Family Wall' },
    { id: 'contact', label: 'Contact' },
  ]

  const handleNavClick = (id: string) => {
    setActiveSection(id)
    setMobileMenuOpen(false)
    
    // Smooth scroll down slightly if needed, or simply let camera focus change
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Find element if exists
      const el = document.getElementById(`section-${id}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out border-b ${
        scrolled
          ? 'py-3 bg-brand-bg/85 backdrop-blur-md border-brand-border/40 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'py-5 bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* GDG Logo Branding */}
        <div 
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => handleNavClick('home')}
        >
          <div className="flex items-center gap-1.5 font-display text-lg font-bold text-white tracking-wide">
            {/* Google colored dots */}
            <div className="flex gap-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-google-blue"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-google-red"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-google-yellow"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-google-green"></span>
            </div>
            <span>GDG <span className="font-light text-brand-muted text-sm">on Campus RMKEC</span></span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative py-1.5 px-1 font-display text-sm font-medium tracking-wide transition-colors duration-300 ${
                activeSection === item.id 
                  ? 'text-brand-accent' 
                  : 'text-brand-muted hover:text-white'
              }`}
            >
              {item.label}
              
              {/* Sliding glowing line underline */}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-accent shadow-[0_0_8px_#7DF9FF] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Audio toggle button */}
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-2 rounded-full border border-brand-border/40 bg-brand-surface/40 hover:bg-brand-accent/10 hover:border-brand-accent/50 text-brand-muted hover:text-brand-accent transition-all duration-300"
            title={soundMuted ? "Unmute Ambient Sound" : "Mute Ambient Sound"}
          >
            {soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Join Portal CTA button */}
          <button
            onClick={() => handleNavClick('join')}
            className="relative px-5 py-2 font-display text-xs font-semibold uppercase tracking-wider text-white border border-brand-accent/30 rounded-lg glass-panel glow-cyan border-sweep overflow-hidden"
          >
            Join GDG
          </button>
        </div>

        {/* Mobile Navigation controls */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-1.5 rounded-full border border-brand-border/30 bg-brand-surface text-brand-muted hover:text-brand-accent"
          >
            {soundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg border border-brand-border/40 text-white bg-brand-surface/60"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-[100%] left-0 w-full bg-brand-bg/95 border-b border-brand-border backdrop-blur-lg flex flex-col gap-3 p-6 shadow-2xl animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`py-2 text-left font-display text-base font-semibold border-b border-brand-border/30 ${
                activeSection === item.id ? 'text-brand-accent' : 'text-brand-muted'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('join')}
            className="w-full mt-2 py-2.5 text-center font-display text-xs font-bold uppercase tracking-wider text-white border border-brand-accent bg-brand-surface rounded"
          >
            Join Community
          </button>
        </div>
      )}
    </nav>
  )
}
