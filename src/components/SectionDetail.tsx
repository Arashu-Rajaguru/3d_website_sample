import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, CheckCircle, ArrowLeft, Send, Sparkles, MapPin, 
  Clock, Play, Code, ExternalLink
} from 'lucide-react'

interface SectionDetailProps {
  activeSection: string
  onClose: () => void
}

export function SectionDetail({ activeSection, onClose }: SectionDetailProps) {
  const [formData, setFormData] = useState({ name: '', email: '', wing: 'Tech Operations', message: '' })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState('Web')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return
    // Show premium visual submit state
    setFormSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', wing: 'Tech Operations', message: '' })
      setFormSubmitted(false)
      onClose()
    }, 2800)
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'about':
        return (
          <div className="space-y-5">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-google-red font-bold uppercase block mb-1">FOUNDATION // SEPTEMBER 2025</span>
              <h3 className="text-2xl font-display font-bold text-white leading-tight">Who We Are</h3>
              <p className="text-brand-muted text-xs leading-relaxed mt-2">
                GDG on Campus RMKEC is an elite student technology chapter operating within the R.M.K. Engineering College campus, under Google Developers network. We bridge the gap between academic theory and actual production engineering.
              </p>
            </div>
            
            <div className="p-4 rounded-xl border border-brand-border/40 bg-brand-surface/40 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Core Pillars</h4>
              <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-brand-muted">
                <div className="flex items-center gap-1.5"><CheckCircle size={10} className="text-google-red" /> Technical Excellence</div>
                <div className="flex items-center gap-1.5"><CheckCircle size={10} className="text-google-blue" /> Collaborative Culture</div>
                <div className="flex items-center gap-1.5"><CheckCircle size={10} className="text-google-yellow" /> Open Source Code</div>
                <div className="flex items-center gap-1.5"><CheckCircle size={10} className="text-google-green" /> Ecosystem Impact</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Chapter Leadership</h4>
              <div className="p-3 rounded-lg border border-brand-border/30 bg-black/40 text-[11px]">
                <div className="flex justify-between font-mono mb-1">
                  <span className="text-white font-bold">Dr. K. R. Senthil Kumar</span>
                  <span className="text-brand-muted">Principal / Advisor</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-white font-bold">Faculty Coordinator</span>
                  <span className="text-brand-muted">RMK CSE Dept</span>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'journey':
        return (
          <div className="space-y-5">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-google-yellow font-bold uppercase block mb-1">CHAPTER ROADMAP</span>
              <h3 className="text-2xl font-display font-bold text-white">Our Journey Timeline</h3>
              <p className="text-brand-muted text-xs leading-relaxed mt-1">
                Visualizing the step-by-step progress and future target operations of the RMKEC developer chapter.
              </p>
            </div>

            <div className="relative pl-6 border-l border-brand-border/60 space-y-6 text-xs mt-4">
              <div className="relative">
                <span className="absolute -left-[29px] top-1.5 w-3.5 h-3.5 rounded-full bg-google-blue flex items-center justify-center text-[8px] font-bold font-mono text-white">1</span>
                <span className="text-[9px] font-mono text-google-blue font-bold">SEP 2025</span>
                <h4 className="font-bold text-white font-display mt-0.5">Community Foundation</h4>
                <p className="text-[11px] text-brand-muted mt-0.5">Official approval and launch of GDG on Campus RMKEC chapter. Formed core operations teams and selected tech leads.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[29px] top-1.5 w-3.5 h-3.5 rounded-full bg-google-red flex items-center justify-center text-[8px] font-bold font-mono text-white">2</span>
                <span className="text-[9px] font-mono text-google-red font-bold">OCT 2025</span>
                <h4 className="font-bold text-white font-display mt-0.5">Google Cloud Campaign Study Jams</h4>
                <p className="text-[11px] text-brand-muted mt-0.5">Over 100 participants enrolled. 40+ completed pathway challenges. T-shirts and swags successfully distributed by the Principal.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[29px] top-1.5 w-3.5 h-3.5 rounded-full bg-google-yellow flex items-center justify-center text-[8px] font-bold font-mono text-white">3</span>
                <span className="text-[9px] font-mono text-google-yellow font-bold">JAN - MAR 2026</span>
                <h4 className="font-bold text-white font-display mt-0.5">Software Incubations</h4>
                <p className="text-[11px] text-brand-muted mt-0.5">Began developing the Real-Time College Bus Tracking System. Conducted internal ideation sessions and AI Collage Days.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[29px] top-1.5 w-3.5 h-3.5 rounded-full bg-google-green flex items-center justify-center text-[8px] font-bold font-mono text-white">4</span>
                <span className="text-[9px] font-mono text-google-green font-bold">FALL 2026</span>
                <h4 className="font-bold text-white font-display mt-0.5">HackNEXA'26 & Scalability</h4>
                <p className="text-[11px] text-brand-muted mt-0.5">Preparing to host the largest hackathon under TechSprint Campaign, expecting 650+ participating developer teams.</p>
              </div>
            </div>
          </div>
        )

      case 'events':
        return (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-google-green font-bold uppercase block mb-1">ENGINEERING CAMPAIGNS</span>
              <h3 className="text-2xl font-display font-bold text-white">Event Arena</h3>
              <p className="text-brand-muted text-xs mt-1">
                Explore key learning study jams and regional hackathons organized by our teams.
              </p>
            </div>

            <div className="space-y-3 mt-4">
              {/* Event 1 details */}
              <div className="p-3.5 rounded-xl border border-brand-border/40 bg-brand-surface/40">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white font-display">Google Cloud Campaign Study Jam</h4>
                  <span className="px-2 py-0.5 text-[8px] font-mono bg-google-blue/10 border border-google-blue/30 text-google-blue rounded">OCT 2025</span>
                </div>
                <ul className="text-[11px] text-brand-muted mt-2 space-y-1">
                  <li>• <strong>100+</strong> active learning participants</li>
                  <li>• <strong>40</strong> milestone pathway completers</li>
                  <li>• T-shirt rewards distributed to students by the Principal</li>
                </ul>
              </div>

              {/* Event 2 details */}
              <div className="p-3.5 rounded-xl border border-brand-border/40 bg-brand-surface/40">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white font-display">HackNEXA'26 Hackathon</h4>
                  <span className="px-2 py-0.5 text-[8px] font-mono bg-google-red/10 border border-google-red/30 text-google-red rounded">UPCOMING</span>
                </div>
                <ul className="text-[11px] text-brand-muted mt-2 space-y-1">
                  <li>• Largest hackathon in RMK Group of Institutions</li>
                  <li>• <strong>650+</strong> registered participating teams</li>
                  <li>• Top 3 teams to receive premium GDG India swags</li>
                </ul>
              </div>

              {/* Event 3 details */}
              <div className="p-3.5 rounded-xl border border-brand-border/40 bg-brand-surface/40">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white font-display">Agentic AI Study Jam</h4>
                  <span className="px-2 py-0.5 text-[8px] font-mono bg-google-yellow/10 border border-google-yellow/30 text-google-yellow rounded">TBA</span>
                </div>
                <p className="text-[11px] text-brand-muted mt-1.5">
                  Deep-dive hands-on session focusing on LLM agents, LangChain, and orchestration systems organized by our Event Management Team.
                </p>
              </div>
            </div>
          </div>
        )

      case 'domains':
        return (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#a855f7] font-bold uppercase block mb-1">TECHNOLOGY SEGMENTS</span>
              <h3 className="text-2xl font-display font-bold text-white">Tech Domains</h3>
              <p className="text-brand-muted text-xs mt-1">
                Click tabs to inspect the core focus areas of our technical operations.
              </p>
            </div>

            {/* Selector tabs */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {['Web', 'AI', 'Cloud', 'Android', 'Cybersecurity', 'UI/UX', 'Backend'].map((dom) => (
                <button
                  key={dom}
                  onClick={() => setSelectedDomain(dom)}
                  className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded border transition-all ${
                    selectedDomain === dom 
                      ? 'bg-brand-accent/15 border-brand-accent text-brand-accent' 
                      : 'bg-brand-surface/20 border-brand-border text-brand-muted hover:text-white'
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>

            {/* Displaying domain details */}
            <div className="p-4 rounded-xl border border-brand-border/40 bg-brand-surface/40 mt-4 min-h-[160px] flex flex-col justify-between">
              {selectedDomain === 'Web' && (
                <div>
                  <h4 className="text-sm font-bold text-google-blue font-display">Web & Client Architectures</h4>
                  <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                    Focuses on high-performance interfaces, React architectures, interactive experiences (Three.js/WebGL), and core performance optimizations.
                  </p>
                </div>
              )}
              {selectedDomain === 'AI' && (
                <div>
                  <h4 className="text-sm font-bold text-google-red font-display">Artificial Intelligence & ML</h4>
                  <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                    Dedicated to fine-tuning machine learning models, developing generative AI integrations, building agents, and data modeling.
                  </p>
                </div>
              )}
              {selectedDomain === 'Cloud' && (
                <div>
                  <h4 className="text-sm font-bold text-google-yellow font-display">Cloud Infrastructure</h4>
                  <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                    Teaches serverless architectures, containerization (Docker, K8s), microservices, Google Cloud Platform (GCP) configurations, and DevOps.
                  </p>
                </div>
              )}
              {selectedDomain === 'Android' && (
                <div>
                  <h4 className="text-sm font-bold text-google-green font-display">Android Applications</h4>
                  <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                    Builds responsive mobile applications using Kotlin, Jetpack Compose, and cross-platform native SDK interfaces.
                  </p>
                </div>
              )}
              {selectedDomain === 'Cybersecurity' && (
                <div>
                  <h4 className="text-sm font-bold text-brand-accent font-display">Information Security</h4>
                  <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                    Covers network penetration testing, secure software development lifecycles, cryptography fundamentals, and security configurations.
                  </p>
                </div>
              )}
              {selectedDomain === 'UI/UX' && (
                <div>
                  <h4 className="text-sm font-bold text-purple-400 font-display">User Interfaces & Motion Design</h4>
                  <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                    Designs user journeys, wireframes, cinematic mockups, and establishes accessibility design systems across all devices.
                  </p>
                </div>
              )}
              {selectedDomain === 'Backend' && (
                <div>
                  <h4 className="text-sm font-bold text-emerald-400 font-display">Backend Core Engineering</h4>
                  <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                    Develops robust APIs, database engines, real-time sync adapters, memory caching, and scales data storage channels.
                  </p>
                </div>
              )}
              <div className="flex gap-2 mt-4 text-[9px] font-mono text-brand-accent">
                <span className="px-2 py-0.5 rounded bg-brand-accent/5 border border-brand-accent/25">ACTIVE_NODE</span>
                <span className="px-2 py-0.5 rounded bg-brand-surface/40 border border-brand-border/40 text-brand-muted">COMPLETED_CAMPUS_ISLAND</span>
              </div>
            </div>
          </div>
        )

      case 'projects':
        return (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-google-blue font-bold uppercase block mb-1">DEVELOPMENT LAB</span>
              <h3 className="text-2xl font-display font-bold text-white">Campus Projects</h3>
              <p className="text-brand-muted text-xs mt-1">
                Fostering campus utility solutions built inside our software incubation center.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-brand-border/40 bg-brand-surface/40">
              <h4 className="text-sm font-bold text-white font-display">Real-Time College Bus Tracking System</h4>
              <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
                A software solution resolving bus location transparency for thousands of students and faculty members.
              </p>

              <div className="mt-3 space-y-2">
                <span className="text-[10px] font-mono text-brand-accent font-semibold block uppercase">Core Objectives</span>
                <ul className="text-[11px] text-brand-muted space-y-1 pl-3.5 list-disc">
                  <li>GPS-tracked real-time location visibility.</li>
                  <li>Schedules optimization & traffic route forecasts.</li>
                  <li>Unified student map interface & notifications.</li>
                  <li>Better administration fleet management.</li>
                </ul>
              </div>

              <div className="mt-4 pt-3.5 border-t border-brand-border/20 flex flex-wrap gap-1.5 text-[9px] font-mono text-brand-muted">
                <span className="px-2 py-0.5 rounded bg-brand-surface/40 border border-brand-border">REACT_NATIVE</span>
                <span className="px-2 py-0.5 rounded bg-brand-surface/40 border border-brand-border">FIREBASE</span>
                <span className="px-2 py-0.5 rounded bg-brand-surface/40 border border-brand-border">MAPS_API</span>
                <span className="px-2 py-0.5 rounded bg-brand-surface/40 border border-brand-border">WEBGL_DASH</span>
              </div>
            </div>

            <div className="flex gap-2">
              <a href="#demo" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-google-blue hover:bg-google-blue/80 text-white text-xs font-bold uppercase transition-all">
                <Play size={12} /> Launch Live Demo
              </a>
              <a href="#code" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-brand-border hover:border-white text-white text-xs font-semibold uppercase transition-all">
                <Code size={12} /> Source Code
              </a>
            </div>
          </div>
        )

      case 'community':
        return (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-brand-accent font-bold uppercase block mb-1">ORGANIZATION STRUCT</span>
              <h3 className="text-2xl font-display font-bold text-white">Community Nodes</h3>
              <p className="text-brand-muted text-xs mt-1">
                Specialized wings coordinating campaigns, design templates, and code repos.
              </p>
            </div>

            <div className="space-y-3 mt-4">
              <div className="p-3.5 rounded-lg border border-brand-border/40 bg-brand-surface/30">
                <h4 className="text-xs font-bold text-white uppercase font-display tracking-wider">Tech Wing Operations</h4>
                <p className="text-[11px] text-brand-muted mt-1 leading-relaxed">
                  Responsible for workshops, project incubation, managing study jams, and compiling software repos. Coordinates AI/ML, Cybersecurity, Cloud, and Web divisions.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-brand-border/40 bg-brand-surface/30">
                <h4 className="text-xs font-bold text-white uppercase font-display tracking-wider">Public Relations (PR)</h4>
                <p className="text-[11px] text-brand-muted mt-1 leading-relaxed">
                  Controls campus community announcements, outreach programs, industry collaboration connects, and manages chapter news releases.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-brand-border/40 bg-brand-surface/30">
                <h4 className="text-xs font-bold text-white uppercase font-display tracking-wider">Event Management</h4>
                <p className="text-[11px] text-brand-muted mt-1 leading-relaxed">
                  Ensures perfect logistics execution for campus events, organizes stages, coordinates check-in systems, and organizes certifications.
                </p>
              </div>
            </div>
          </div>
        )

      case 'family':
        return (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-google-yellow font-bold uppercase block mb-1">CHAPTER PEOPLE</span>
              <h3 className="text-2xl font-display font-bold text-white">Meet Our Family</h3>
              <p className="text-brand-muted text-xs mt-1">
                The students dedicating time and creativity to maintain a thriving campus ecosystem.
              </p>
            </div>

            {/* List members explicitly */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {[
                { name: 'Rohan K', role: 'Community Lead', info: 'Drives operations, handles chapter administration & strategy' },
                { name: 'Sneha M', role: 'Co-Lead / PM', info: 'Coordinates wing leaders, event timelines & projects sync' },
                { name: 'Abhishek R', role: 'Technical Admin', info: 'Handles servers, repository releases & cloud setups' },
                { name: 'Kavitha P', role: 'PR Executive', info: 'Manages social media networks & chapter outreach' },
                { name: 'Ganesh S', role: 'HR Head', info: 'Oversees member recruitments, schedules & coordination' },
                { name: 'Divya T', role: 'Event Manager', info: 'Orchestrates workshops, stages & hackathon check-ins' },
                { name: 'Nikhil K', role: 'Design Lead', info: 'Builds vector logos, UI wireframes & branding assets' }
              ].map((member, i) => (
                <div key={i} className="p-3 rounded-lg border border-brand-border/30 bg-brand-surface/20 flex gap-3 items-center">
                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-[10px]">
                    {member.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white font-display leading-none">{member.name}</span>
                      <span className="text-[8px] font-mono font-bold text-google-yellow uppercase leading-none">{member.role}</span>
                    </div>
                    <p className="text-[10px] text-brand-muted mt-0.5 leading-snug">{member.info}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'join':
        return (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-brand-accent font-bold uppercase block mb-1">REGISTRATION SYSTEM</span>
              <h3 className="text-2xl font-display font-bold text-white">Join the Community</h3>
              <p className="text-brand-muted text-xs mt-1">
                Submit details below to join the waitlist database for upcoming developer campaigns.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!formSubmitted ? (
                <motion.form 
                  onSubmit={handleFormSubmit} 
                  className="space-y-3.5 mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-muted mb-1">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Adithya R"
                      className="w-full bg-black/60 border border-brand-border/80 focus:border-brand-accent text-white text-xs px-3.5 py-2.5 rounded-lg outline-none transition-all font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-muted mb-1">College Email</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. adithya.r@rmkec.ac.in"
                      className="w-full bg-black/60 border border-brand-border/80 focus:border-brand-accent text-white text-xs px-3.5 py-2.5 rounded-lg outline-none transition-all font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-muted mb-1">Preferred Wing</label>
                    <select 
                      name="wing"
                      value={formData.wing}
                      onChange={handleInputChange}
                      className="w-full bg-black/80 border border-brand-border/80 focus:border-brand-accent text-white text-xs px-3.5 py-2.5 rounded-lg outline-none transition-all font-mono"
                    >
                      <option>Tech Operations</option>
                      <option>PR Operations</option>
                      <option>HR & Management</option>
                      <option>Event Management</option>
                      <option>Design & Branding</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-muted mb-1">Aspiration / Details</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Why do you want to join GDG RMKEC?"
                      className="w-full bg-black/60 border border-brand-border/80 focus:border-brand-accent text-white text-xs px-3.5 py-2.5 rounded-lg outline-none transition-all font-sans resize-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-brand-accent hover:bg-brand-accent/80 text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(125,249,255,0.4)]"
                  >
                    <Send size={12} /> Submit Registration
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  className="flex flex-col items-center justify-center text-center py-10 space-y-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="w-16 h-16 rounded-full bg-brand-accent/10 border-2 border-brand-accent flex items-center justify-center text-brand-accent animate-bounce">
                    <Sparkles size={28} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">System Connection Success</h4>
                    <p className="text-xs text-brand-muted mt-1 max-w-xs leading-relaxed">
                      Your credentials have been logged in the GDG RMKEC waitlist. We will notify you of upcoming recruiting sessions.
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-brand-accent animate-pulse">SYNCHRONIZING DATABASE...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#a855f7] font-bold uppercase block mb-1">STATION TERMINAL</span>
              <h3 className="text-2xl font-display font-bold text-white">Communicator</h3>
              <p className="text-brand-muted text-xs mt-1">
                Reach out to coordinate events, sponsorship, or register questions.
              </p>
            </div>

            <div className="space-y-3.5">
              <div className="p-3 rounded-lg border border-brand-border/40 bg-brand-surface/30 space-y-2">
                <span className="text-[10px] font-mono text-[#a855f7] uppercase font-bold tracking-wider block">Physical Coordinates</span>
                <div className="flex items-start gap-2 text-xs">
                  <MapPin size={16} className="text-[#a855f7] mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] text-brand-muted leading-relaxed">
                    <strong>R.M.K. Engineering College</strong><br />
                    NH-5, RSM Nagar, Kavaraipettai, Gummidipoondi Taluk, Tamil Nadu 601206.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-brand-border/40 bg-brand-surface/30 space-y-2">
                <span className="text-[10px] font-mono text-[#a855f7] uppercase font-bold tracking-wider block">Operational Hours</span>
                <div className="flex items-center gap-2 text-xs text-brand-muted font-mono">
                  <Clock size={14} className="text-google-yellow" />
                  <span>Mon - Sat // 08:30 AM - 04:00 PM IST</span>
                </div>
              </div>
              
              <div className="p-3.5 rounded-lg border border-brand-border bg-black/60">
                <h4 className="text-xs font-bold text-white font-display mb-1.5">Direct Message Link</h4>
                <div className="space-y-2 text-[10px] font-mono">
                  <div className="flex justify-between border-b border-brand-border/30 pb-1 text-brand-muted">
                    <span>Email Link</span>
                    <a href="mailto:gdg@rmkec.ac.in" className="text-brand-accent hover:underline font-bold">gdg@rmkec.ac.in</a>
                  </div>
                  <div className="flex justify-between border-b border-brand-border/30 pb-1 text-brand-muted">
                    <span>Admin Center</span>
                    <a href="https://rmkec.ac.in" target="_blank" rel="noreferrer" className="text-brand-accent hover:underline font-bold">rmkec.ac.in <ExternalLink size={8} className="inline" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm flex items-center justify-start pointer-events-none p-4 md:p-8">
      {/* Detail panel (slides in from left) */}
      <motion.div
        className="w-full max-w-md h-full glass-panel scanline rounded-2xl p-6 md:p-8 flex flex-col justify-between pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-brand-accent/30"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-brand-border/40 pb-4 mb-5">
            <button 
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs text-brand-muted hover:text-white transition-colors uppercase font-mono font-bold"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg border border-brand-border/60 text-brand-muted hover:text-white hover:border-white transition-all bg-brand-surface/40"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrolling details box */}
          <div className="overflow-y-auto max-h-[calc(100vh-230px)] pr-2 scrollbar-thin scrollbar-thumb-brand-accent/20">
            {renderContent()}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-brand-border/30 pt-4 mt-4 text-center">
          <button 
            onClick={onClose}
            className="w-full py-2.5 border border-brand-border hover:border-white text-white text-xs font-semibold uppercase tracking-wider rounded-lg bg-brand-surface/20 transition-all"
          >
            Restore Overview
          </button>
        </div>
      </motion.div>
    </div>
  )
}
