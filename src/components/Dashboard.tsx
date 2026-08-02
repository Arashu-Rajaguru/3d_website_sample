import { motion } from 'framer-motion'
import { 
  ArrowRight, ExternalLink, Globe, Cpu, Cloud, Smartphone, 
  ShieldAlert, Layers, Server, Mail, Linkedin, 
  Instagram, Github, Calendar, CheckCircle
} from 'lucide-react'

interface DashboardProps {
  setActiveSection: (sec: string) => void
  onZoomSection: (sec: string) => void
}

export function Dashboard({ setActiveSection, onZoomSection }: DashboardProps) {
  
  // Animation presets for entering panels
  const panelVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.8, 0.25, 1] } 
    }
  }

  return (
    <div className="w-full relative z-20 min-h-screen pt-24 pb-20 px-4 md:px-8 space-grid">
      <div className="dashboard-grid max-w-[1600px] mx-auto">
        
        {/* ==============================================
            01. HERO / MAIN HEADLINE (Span 8 Col)
           ============================================== */}
        <motion.div 
          className="col-span-12 lg:col-span-8 glass-panel glow-cyan scanline p-6 md:p-8 rounded-2xl flex flex-col justify-between min-h-[420px]"
          variants={panelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          onMouseEnter={() => setActiveSection('home')}
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 font-mono text-[10px] tracking-widest text-brand-accent border border-brand-accent/30 rounded bg-brand-surface">SYSTEM_01 // HERO</span>
              <span className="w-1.5 h-1.5 rounded-full bg-google-blue animate-ping"></span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight tracking-tight select-none">
              Building the <span className="clip-text-g">Future</span> <br />
              of Technology
            </h1>
            <p className="mt-4 text-brand-muted text-sm md:text-base max-w-xl font-display font-medium">
              Google Developer Group on Campus – R.M.K. Engineering College is a student-led technology community empowering builders to innovate and solve real-world challenges.
            </p>
          </div>

          <div className="mt-8">
            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => onZoomSection('join')}
                className="px-6 py-2.5 rounded-lg bg-google-blue hover:bg-google-blue/80 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(66,133,244,0.3)] hover:scale-105"
              >
                Join Community
              </button>
              <button 
                onClick={() => onZoomSection('projects')}
                className="px-5 py-2.5 rounded-lg border border-brand-border hover:border-white text-white text-xs font-semibold uppercase tracking-wider bg-brand-surface/40 hover:bg-brand-surface transition-all"
              >
                Explore Projects
              </button>
              <button 
                onClick={() => onZoomSection('events')}
                className="px-5 py-2.5 rounded-lg border border-brand-border hover:border-white text-white text-xs font-semibold uppercase tracking-wider bg-brand-surface/40 hover:bg-brand-surface transition-all flex items-center gap-2"
              >
                View Events <ArrowRight size={14} />
              </button>
            </div>

            {/* Quick stats snapshot footer */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-8 pt-6 border-t border-brand-border/40 text-center">
              <div>
                <h4 className="text-xl font-bold text-white font-mono">650+</h4>
                <p className="text-[10px] text-brand-muted uppercase font-mono mt-0.5">Hackathon Teams</p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-google-blue font-mono">250+</h4>
                <p className="text-[10px] text-brand-muted uppercase font-mono mt-0.5">Evaluated</p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-google-yellow font-mono">100+</h4>
                <p className="text-[10px] text-brand-muted uppercase font-mono mt-0.5">Participants</p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-google-green font-mono">40+</h4>
                <p className="text-[10px] text-brand-muted uppercase font-mono mt-0.5">Cloud Jams</p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-brand-accent font-mono">∞</h4 >
                <p className="text-[10px] text-brand-muted uppercase font-mono mt-0.5">Projects</p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-google-red font-mono">100%</h4>
                <p className="text-[10px] text-brand-muted uppercase font-mono mt-0.5">Committed</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ==============================================
            02. ABOUT (Span 4 Col)
           ============================================== */}
        <motion.div 
          className="col-span-12 md:col-span-6 lg:col-span-4 glass-panel glow-cyan p-6 rounded-2xl flex flex-col justify-between"
          variants={panelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          onMouseEnter={() => setActiveSection('about')}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2 py-0.5 font-mono text-[10px] tracking-widest text-google-red border border-google-red/30 rounded bg-brand-surface">SYSTEM_02 // ABOUT</span>
              <button onClick={() => onZoomSection('about')} className="text-brand-muted hover:text-white"><ExternalLink size={14} /></button>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">Who We Are</h2>
            <p className="text-brand-muted text-xs leading-relaxed font-sans mb-4">
              GDG on Campus RMKEC is a student-driven technology community focused on fostering innovation, technical excellence, and collaborative learning.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-brand-border/40">
            <div>
              <h4 className="text-xs font-bold text-google-blue font-display uppercase tracking-wider">Our Mission</h4>
              <p className="text-[11px] text-brand-muted leading-snug mt-0.5">
                Promote technical learning, build campus solutions, and develop future technology leaders.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-google-green font-display uppercase tracking-wider">Our Vision</h4>
              <p className="text-[11px] text-brand-muted leading-snug mt-0.5">
                To be a leading student tech hub recognized for innovation and meaningful college ecosystem impact.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ==============================================
            03. JOURNEY / TIMELINE (Span 4 Col)
           ============================================== */}
        <motion.div 
          className="col-span-12 md:col-span-6 lg:col-span-4 glass-panel glow-cyan p-6 rounded-2xl flex flex-col justify-between"
          variants={panelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          onMouseEnter={() => setActiveSection('journey')}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2 py-0.5 font-mono text-[10px] tracking-widest text-google-yellow border border-google-yellow/30 rounded bg-brand-surface">SYSTEM_03 // JOURNEY</span>
              <button onClick={() => onZoomSection('journey')} className="text-brand-muted hover:text-white"><ExternalLink size={14} /></button>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-4">Our Journey</h2>
          </div>

          <div className="relative pl-4 space-y-4 border-l border-brand-border/60 text-xs">
            <div className="relative">
              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-google-blue shadow-[0_0_8px_#4285F4]"></span>
              <h4 className="font-bold text-white font-mono">2025 - The Beginning</h4>
              <p className="text-[11px] text-brand-muted">Chapter established. Started community building.</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-google-red shadow-[0_0_8px_#ea4335]"></span>
              <h4 className="font-bold text-white font-mono">Events & Growth</h4>
              <p className="text-[11px] text-brand-muted">Cloud study jams and workshops kicked off.</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-google-yellow shadow-[0_0_8px_#FBBC05]"></span>
              <h4 className="font-bold text-white font-mono">Building Impact</h4>
              <p className="text-[11px] text-brand-muted">Developed college utility software.</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-google-green shadow-[0_0_8px_#34A853]"></span>
              <h4 className="font-bold text-white font-mono">The Future</h4>
              <p className="text-[11px] text-brand-muted">AI solutions & massive campus-wide hackathons.</p>
            </div>
          </div>
        </motion.div>

        {/* ==============================================
            04. EVENTS (Span 8 Col)
           ============================================== */}
        <motion.div 
          className="col-span-12 lg:col-span-8 glass-panel glow-cyan p-6 rounded-2xl flex flex-col justify-between"
          variants={panelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          onMouseEnter={() => setActiveSection('events')}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2 py-0.5 font-mono text-[10px] tracking-widest text-google-green border border-google-green/30 rounded bg-brand-surface">SYSTEM_04 // EVENTS</span>
              <button onClick={() => onZoomSection('events')} className="text-brand-muted hover:text-white flex items-center gap-1 text-[11px]">View All Arena <ExternalLink size={12} /></button>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">Event Arena</h2>
            <p className="text-brand-muted text-xs mb-5 font-sans">
              Take a look at active and past engineering campaigns hosted by GDG RMKEC.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Event 1 */}
            <div className="p-4 rounded-xl border border-brand-border/40 bg-brand-surface/40 flex flex-col justify-between min-h-[140px]">
              <div>
                <Calendar className="text-google-blue mb-2" size={16} />
                <h4 className="text-xs font-bold text-white font-display leading-tight">Google Cloud Study Jam</h4>
              </div>
              <div className="text-[10px] text-brand-muted mt-2 border-t border-brand-border/20 pt-2 font-mono">
                <span>OCT 2025</span>
                <span className="block text-google-blue font-semibold">100+ Joined</span>
              </div>
            </div>

            {/* Event 2 */}
            <div className="p-4 rounded-xl border border-brand-border/40 bg-brand-surface/40 flex flex-col justify-between min-h-[140px]">
              <div>
                <Calendar className="text-google-red mb-2" size={16} />
                <h4 className="text-xs font-bold text-white font-display leading-tight">HackNEXA'26 Hackathon</h4>
              </div>
              <div className="text-[10px] text-brand-muted mt-2 border-t border-brand-border/20 pt-2 font-mono">
                <span>UPCOMING</span>
                <span className="block text-google-red font-semibold">650+ Teams</span>
              </div>
            </div>

            {/* Event 3 */}
            <div className="p-4 rounded-xl border border-brand-border/40 bg-brand-surface/40 flex flex-col justify-between min-h-[140px]">
              <div>
                <Calendar className="text-google-yellow mb-2" size={16} />
                <h4 className="text-xs font-bold text-white font-display leading-tight">Agentic AI Study Jam</h4>
              </div>
              <div className="text-[10px] text-brand-muted mt-2 border-t border-brand-border/20 pt-2 font-mono">
                <span>TBA</span>
                <span className="block text-google-yellow font-semibold">Hands-on AI</span>
              </div>
            </div>

            {/* Event 4 */}
            <div className="p-4 rounded-xl border border-brand-border/40 bg-brand-surface/40 flex flex-col justify-between min-h-[140px]">
              <div>
                <Calendar className="text-brand-accent mb-2" size={16} />
                <h4 className="text-xs font-bold text-white font-display leading-tight">A.C.E. - AI Collage Day</h4>
              </div>
              <div className="text-[10px] text-brand-muted mt-2 border-t border-brand-border/20 pt-2 font-mono">
                <span>TBA</span>
                <span className="block text-brand-accent font-semibold">Online Pitch</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ==============================================
            05. TECH DOMAINS (Span 6 Col)
           ============================================== */}
        <motion.div 
          className="col-span-12 md:col-span-6 glass-panel glow-purple p-6 rounded-2xl flex flex-col justify-between"
          variants={panelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          onMouseEnter={() => setActiveSection('domains')}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2 py-0.5 font-mono text-[10px] tracking-widest text-[#a855f7] border border-[#a855f7]/30 rounded bg-brand-surface">SYSTEM_05 // DOMAINS</span>
              <button onClick={() => onZoomSection('domains')} className="text-brand-muted hover:text-white"><ExternalLink size={14} /></button>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">Technology Islands</h2>
            <p className="text-brand-muted text-xs mb-5 font-sans">
              Each floating island in our campus environment represents a core technological branch.
            </p>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 pt-4 border-t border-brand-border/30 text-center">
            <div className="p-2 bg-brand-surface/30 border border-brand-border/20 rounded flex flex-col items-center justify-center cursor-pointer hover:border-google-blue" onClick={() => onZoomSection('domains')}>
              <Globe size={18} className="text-google-blue" />
              <span className="text-[9px] font-mono mt-1 text-white uppercase block">Web</span>
            </div>
            <div className="p-2 bg-brand-surface/30 border border-brand-border/20 rounded flex flex-col items-center justify-center cursor-pointer hover:border-google-red" onClick={() => onZoomSection('domains')}>
              <Cpu size={18} className="text-google-red" />
              <span className="text-[9px] font-mono mt-1 text-white uppercase block">AI</span>
            </div>
            <div className="p-2 bg-brand-surface/30 border border-brand-border/20 rounded flex flex-col items-center justify-center cursor-pointer hover:border-google-yellow" onClick={() => onZoomSection('domains')}>
              <Cloud size={18} className="text-google-yellow" />
              <span className="text-[9px] font-mono mt-1 text-white uppercase block">Cloud</span>
            </div>
            <div className="p-2 bg-brand-surface/30 border border-brand-border/20 rounded flex flex-col items-center justify-center cursor-pointer hover:border-google-green" onClick={() => onZoomSection('domains')}>
              <Smartphone size={18} className="text-google-green" />
              <span className="text-[9px] font-mono mt-1 text-white uppercase block">Android</span>
            </div>
            <div className="p-2 bg-brand-surface/30 border border-brand-border/20 rounded flex flex-col items-center justify-center cursor-pointer hover:border-brand-accent" onClick={() => onZoomSection('domains')}>
              <ShieldAlert size={18} className="text-brand-accent" />
              <span className="text-[9px] font-mono mt-1 text-white uppercase block">Cyber</span>
            </div>
            <div className="p-2 bg-brand-surface/30 border border-brand-border/20 rounded flex flex-col items-center justify-center cursor-pointer hover:border-purple-400" onClick={() => onZoomSection('domains')}>
              <Layers size={18} className="text-purple-400" />
              <span className="text-[9px] font-mono mt-1 text-white uppercase block">UI/UX</span>
            </div>
            <div className="p-2 bg-brand-surface/30 border border-brand-border/20 rounded flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400" onClick={() => onZoomSection('domains')}>
              <Server size={18} className="text-emerald-400" />
              <span className="text-[9px] font-mono mt-1 text-white uppercase block">Backend</span>
            </div>
          </div>
        </motion.div>

        {/* ==============================================
            06. PROJECTS (Span 6 Col)
           ============================================== */}
        <motion.div 
          className="col-span-12 md:col-span-6 glass-panel glow-cyan p-6 rounded-2xl flex flex-col justify-between"
          variants={panelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          onMouseEnter={() => setActiveSection('projects')}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2 py-0.5 font-mono text-[10px] tracking-widest text-google-blue border border-google-blue/30 rounded bg-brand-surface">SYSTEM_06 // PROJECTS</span>
              <button onClick={() => onZoomSection('projects')} className="text-brand-muted hover:text-white"><ExternalLink size={14} /></button>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">Real-Time Bus Tracker</h2>
            <p className="text-brand-muted text-xs leading-relaxed font-sans mb-4">
              A comprehensive campus transportation solution designed to provide real-time bus location visibility and travel planning utility for students, faculty, and administrators.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-brand-border/30">
            <span className="text-[10px] font-mono text-google-blue font-bold px-2 py-0.5 rounded border border-google-blue/30 bg-google-blue/10">DEVELOPMENT ONGOING</span>
            <div className="flex items-center gap-2">
              <a href="#github" className="text-xs font-semibold text-brand-muted hover:text-white border border-brand-border/40 hover:border-white px-3 py-1 rounded transition-all">Github</a>
              <button onClick={() => onZoomSection('projects')} className="text-xs font-bold text-white bg-google-blue hover:bg-google-blue/80 px-3 py-1 rounded transition-all">View Demo</button>
            </div>
          </div>
        </motion.div>

        {/* ==============================================
            07. COMMUNITY STRUCTURE (Span 5 Col)
           ============================================== */}
        <motion.div 
          className="col-span-12 md:col-span-6 lg:col-span-5 glass-panel glow-cyan p-6 rounded-2xl flex flex-col justify-between min-h-[300px]"
          variants={panelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          onMouseEnter={() => setActiveSection('community')}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2 py-0.5 font-mono text-[10px] tracking-widest text-brand-accent border border-brand-accent/30 rounded bg-brand-surface">SYSTEM_07 // STRUCTURE</span>
              <button onClick={() => onZoomSection('community')} className="text-brand-muted hover:text-white"><ExternalLink size={14} /></button>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">Community Structure</h2>
            <p className="text-brand-muted text-xs font-sans mb-4">
              Our framework consists of operations wings and specialized technology nodes mapping directly to the R3F WebGL graph network.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-4 border-t border-brand-border/30">
            <div>
              <span className="block text-google-red font-bold uppercase tracking-wider mb-1.5">Core Team</span>
              <ul className="space-y-1 text-brand-muted">
                <li>• Tech Operations Wing</li>
                <li>• Public Relations Team</li>
                <li>• Human Resources Group</li>
                <li>• Event Management Team</li>
                <li>• Design & Branding</li>
              </ul>
            </div>
            <div>
              <span className="block text-brand-accent font-bold uppercase tracking-wider mb-1.5">Tech Wings</span>
              <ul className="space-y-1 text-brand-muted">
                <li>• AI + Electronics</li>
                <li>• AI/ML Systems</li>
                <li>• Cloud Infrastructure</li>
                <li>• Backend Engineering</li>
                <li>• Cybersecurity</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* ==============================================
            08. FAMILY WALL (Span 7 Col)
           ============================================== */}
        <motion.div 
          className="col-span-12 md:col-span-6 lg:col-span-7 glass-panel glow-cyan p-6 rounded-2xl flex flex-col justify-between"
          variants={panelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          onMouseEnter={() => setActiveSection('family')}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2 py-0.5 font-mono text-[10px] tracking-widest text-google-yellow border border-google-yellow/30 rounded bg-brand-surface">SYSTEM_08 // WALL</span>
              <button onClick={() => onZoomSection('family')} className="text-brand-muted hover:text-white"><ExternalLink size={14} /></button>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">Stronger Together</h2>
            <p className="text-brand-muted text-xs mb-4 font-sans">
              Meet the people behind every event, project, workshop, and community milestone.
            </p>
          </div>

          {/* Simple sliding cards list matching the circular R3F structure */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {[
              { name: 'Rohan K', role: 'Lead', border: 'border-google-blue' },
              { name: 'Sneha M', role: 'Co-Lead', border: 'border-google-red' },
              { name: 'Abhishek R', role: 'Tech Admin', border: 'border-google-yellow' },
              { name: 'Kavitha P', role: 'PR Exec', border: 'border-google-green' },
              { name: 'Ganesh S', role: 'HR Head', border: 'border-brand-accent' }
            ].map((usr, i) => (
              <div 
                key={i}
                className={`p-3 glass-panel-light border-2 rounded-xl flex-shrink-0 w-28 text-center cursor-pointer hover:-translate-y-1 transition-all ${usr.border}`}
                onClick={() => onZoomSection('family')}
              >
                <div className="w-8 h-8 rounded-full bg-white/5 mx-auto mb-1.5 flex items-center justify-center font-bold text-[10px] text-white">
                  {usr.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <h4 className="text-[10px] font-bold text-white whitespace-nowrap">{usr.name}</h4>
                <p className="text-[8px] text-brand-muted uppercase font-mono mt-0.5">{usr.role}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ==============================================
            09. JOIN US PORTAL (Span 6 Col)
           ============================================== */}
        <motion.div 
          className="col-span-12 md:col-span-6 glass-panel glow-cyan p-6 rounded-2xl flex flex-col justify-between"
          variants={panelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          onMouseEnter={() => setActiveSection('join')}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2 py-0.5 font-mono text-[10px] tracking-widest text-brand-accent border border-brand-accent/30 rounded bg-brand-surface">SYSTEM_09 // PORTAL</span>
              <button onClick={() => onZoomSection('join')} className="text-brand-muted hover:text-white"><ExternalLink size={14} /></button>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">Join the Community</h2>
            <p className="text-brand-muted text-xs leading-relaxed font-sans mb-4">
              Connect to our digital portal. Gain access to resources, collaborations, mentorship, and certification jams.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-brand-muted">
              <div className="flex items-center gap-1.5"><CheckCircle size={10} className="text-google-blue" /> Learn Technologies</div>
              <div className="flex items-center gap-1.5"><CheckCircle size={10} className="text-google-red" /> Build Systems</div>
              <div className="flex items-center gap-1.5"><CheckCircle size={10} className="text-google-yellow" /> Share Knowledge</div>
              <div className="flex items-center gap-1.5"><CheckCircle size={10} className="text-google-green" /> Expand Network</div>
            </div>
            <button 
              onClick={() => onZoomSection('join')}
              className="w-full mt-3 py-2.5 rounded-lg border-2 border-brand-accent/40 bg-brand-surface hover:bg-brand-accent/15 text-brand-accent text-xs font-bold uppercase tracking-widest transition-all pulse-portal"
            >
              Enter Portal
            </button>
          </div>
        </motion.div>

        {/* ==============================================
            10. CONTACT / TERMINAL (Span 6 Col)
           ============================================== */}
        <motion.div 
          className="col-span-12 md:col-span-6 glass-panel glow-purple p-6 rounded-2xl flex flex-col justify-between"
          variants={panelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          onMouseEnter={() => setActiveSection('contact')}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2 py-0.5 font-mono text-[10px] tracking-widest text-[#a855f7] border border-[#a855f7]/30 rounded bg-brand-surface">SYSTEM_10 // CONTACT</span>
              <button onClick={() => onZoomSection('contact')} className="text-brand-muted hover:text-white"><ExternalLink size={14} /></button>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">Get in Touch</h2>
            <p className="text-brand-muted text-xs leading-relaxed font-sans mb-4">
              Initialize communication links to RMK Engineering College Google Developer Group chapters.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 pt-4 border-t border-brand-border/30 font-mono text-[10px]">
            <a href="mailto:gdg.rmkec@gmail.com" className="flex items-center justify-between p-2 rounded bg-brand-surface/40 hover:bg-brand-surface transition-all group">
              <span className="flex items-center gap-2 text-brand-muted group-hover:text-white"><Mail size={12} className="text-google-blue" /> Email</span>
              <span className="text-white font-bold group-hover:text-brand-accent transition-colors">gdg@rmkec.ac.in</span>
            </a>
            <div className="flex gap-2">
              <a href="#linkedin" className="flex-1 flex items-center justify-center gap-2 p-2 rounded bg-brand-surface/40 hover:bg-brand-surface border border-brand-border/30 hover:border-google-blue transition-all">
                <Linkedin size={12} className="text-google-blue" />
                <span className="text-[9px] text-white font-bold">LINKEDIN</span>
              </a>
              <a href="#instagram" className="flex-1 flex items-center justify-center gap-2 p-2 rounded bg-brand-surface/40 hover:bg-brand-surface border border-brand-border/30 hover:border-google-red transition-all">
                <Instagram size={12} className="text-google-red" />
                <span className="text-[9px] text-white font-bold">INSTAGRAM</span>
              </a>
              <a href="#github" className="flex-1 flex items-center justify-center gap-2 p-2 rounded bg-brand-surface/40 hover:bg-brand-surface border border-brand-border/30 hover:border-brand-accent transition-all">
                <Github size={12} className="text-brand-accent" />
                <span className="text-[9px] text-white font-bold">GITHUB</span>
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
