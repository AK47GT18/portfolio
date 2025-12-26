'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowUpRight, Github, Mail, Phone,
  Cpu, Database, Terminal, Send, X, ChevronDown,
  Network, Shield, Zap, GitBranch, Code, Globe, Server
} from 'lucide-react';

// --- CONFIGURATION ---
const COLORS = {
  bg: 0x0B0F1A,      // Deep Space Navy
  accent: 0x38F2FF,  // Cyan Glow
  muted: 0x2d3748    // Darker lines
};

const SKILLS = [
  { category: "Languages", items: ["Python", "PHP", "JavaScript", "TypeScript", "SQL", "C++", "HTML/CSS"] },
  { category: "Frameworks", items: ["Next.js", "React", "FastAPI", "Tailwind", "Laravel"] },
  { category: "Infrastructure", items: ["Docker", "Linux", "Git", "MySQL", "PostgreSQL", "Supabase"] },
  { category: "Intelligence", items: ["Scikit-Learn", "Pandas", "Random Forest", "Data Modeling"] }
];

const PRINCIPLES = [
  {
    title: "Constraints First",
    desc: "I don't write a line of code until I understand the bandwidth, the data volume, and the user's hardware.",
    icon: <Shield className="w-6 h-6 text-[#38F2FF]" />
  },
  {
    title: "Fault Tolerance",
    desc: "Happy paths are easy. I design for the 1% of the time when the API fails or the network drops.",
    icon: <Network className="w-6 h-6 text-[#38F2FF]" />
  },
  {
    title: "Simplicity Scaling",
    desc: "Complexity is tech debt. I prefer a boring, robust solution over a clever, fragile one.",
    icon: <Zap className="w-6 h-6 text-[#38F2FF]" />
  }
];

const PROJECTS = [
  {
    title: "Crop Advisory Intelligence",
    role: "ML ARCHITECTURE",
    outcome: "94% Yield Prediction Accuracy",
    constraint: "Must run effectively in rural areas with intermittent connectivity and noisy weather data.",
    architecture: "FastAPI serving a Random Forest model. Implemented offline-first caching via Next.js service workers.",
    tech: ["Python", "FastAPI", "Next.js"],
    link: "https://crop-advisory-delta.vercel.app",
    id: "01"
  },
  {
    title: "Pharma-Core Engine",
    role: "SYSTEMS ARCHITECT",
    outcome: "40% Reduction in Stock Waste",
    constraint: "High-concurrency retail environment where inventory race conditions cause financial loss.",
    architecture: "Relational database design with strict row-level locking. Implemented RBAC to prevent unauthorized overrides.",
    tech: ["PHP 8", "MySQL", "Tailwind"],
    link: "https://next-level.gt.tc",
    id: "02"
  },
  {
    title: "Voice of Livingstonia",
    role: "PLATFORM LEAD",
    outcome: "University-Wide Adoption",
    constraint: "Need for a censorship-resistant news platform that handles spikes in traffic during campus events.",
    architecture: "Custom CMS with optimized query caching. Decoupled frontend delivery from backend logic.",
    tech: ["PHP", "MySQL", "Apache"],
    link: "https://github.com/AK47GT18/VoL-BEHIND-.git",
    id: "03"
  }
];

// --- ANIMATION COMPONENT ---
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default function Portfolio() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // 1. VANTA SETUP
  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(NET({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true, touchControls: true, gyroControls: false,
        minHeight: 200.00, minWidth: 200.00,
        scale: 1.00, scaleMobile: 1.00,
        color: COLORS.accent,
        backgroundColor: COLORS.bg,
        points: 8.00,
        maxDistance: 22.00,
        spacing: 20.00,
        showDots: true,
        backgroundAlpha: 1.0
      }));
    }
    return () => { if (vantaEffect) vantaEffect.destroy(); };
  }, [vantaEffect]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0B0F1A] text-[#E6EAF2] font-sans selection:bg-[#38F2FF] selection:text-[#0B0F1A] overflow-x-hidden">

      {/* Scroll Progress */}
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-[4px] bg-[#38F2FF] origin-left z-[70]" />

      {/* Vanta Layer */}
      <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none opacity-20" />

      {/* Vignette */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#0B0F1A_120%)]" />

      <div className="relative z-10">

        {/* --- NAVBAR --- */}
        <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled
            ? 'bg-[#0B0F1A]/95 backdrop-blur-md border-b border-white/5 py-4'
            : 'py-10 bg-transparent'
          }`}>
          <div className="container mx-auto px-6 flex justify-between items-center">
            <div className="font-mono text-sm tracking-[0.2em] font-bold text-[#E6EAF2]">
              ARTHONY<span className="text-[#38F2FF]">_KANJIRA</span>
            </div>

            <div className="hidden md:flex gap-12 text-xs font-bold tracking-widest text-[#9AA4BF]">
              <a href="#about" className="hover:text-white transition-colors">ABOUT</a>
              <a href="#skills" className="hover:text-white transition-colors">ARSENAL</a>
              <a href="#work" className="hover:text-white transition-colors">SYSTEMS</a>
            </div>

            <button
              onClick={() => setChatOpen(true)}
              className="text-[#38F2FF] text-xs uppercase font-bold tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-2 h-2 bg-[#38F2FF] rounded-full animate-pulse" />
              AI TERMINAL
            </button>
          </div>
        </nav>

        {/* --- HERO SECTION --- */}
        <section className="min-h-screen flex flex-col justify-center px-6">
          <div className="container mx-auto max-w-5xl">
            <Reveal>
              <div className="inline-block mb-8 px-4 py-2 border border-[#38F2FF]/20 rounded-full bg-[#38F2FF]/5">
                <span className="text-xs font-mono text-[#38F2FF] tracking-widest uppercase">Computer Engineering Finalist</span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[1.05] mb-8 text-[#E6EAF2]">
                ENGINEERING SYSTEMS. <br />
                <span className="text-[#9AA4BF]">BUILDING INTELLIGENCE.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="border-l-4 border-[#38F2FF] pl-8 max-w-3xl">
                <p className="text-2xl md:text-3xl text-[#E6EAF2] font-light leading-relaxed">
                  I design software that survives bad data, weak networks, and real users.
                </p>
              </div>
            </Reveal>
          </div>

          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute bottom-12 left-6 text-[#9AA4BF] text-xs font-mono tracking-widest rotate-90 origin-left"
          >
            SCROLL TO DECRYPT
          </motion.div>
        </section>

        {/* --- ABOUT ME (THE OPERATOR) --- */}
        <section id="about" className="py-32 px-6 border-t border-white/5 bg-[#0B0F1A]/80 backdrop-blur-sm">
          <div className="container mx-auto max-w-5xl grid md:grid-cols-12 gap-16 items-start">
            <div className="md:col-span-4">
              <Reveal>
                <span className="text-[#38F2FF] font-mono text-sm tracking-widest uppercase mb-4 block">01 // The Operator</span>
                <h2 className="text-4xl font-bold text-[#E6EAF2]">WHO I AM</h2>
              </Reveal>
            </div>
            <div className="md:col-span-8 space-y-8">
              <Reveal delay={0.2}>
                <p className="text-xl md:text-2xl text-[#9AA4BF] leading-relaxed">
                  I am <strong className="text-[#E6EAF2]">Arthony Kanjira</strong>, a final year Computer Engineering student based in Malawi.
                </p>
                <p className="text-lg text-[#9AA4BF] leading-relaxed">
                  My work sits at the intersection of <span className="text-[#E6EAF2]">software engineering</span> and <span className="text-[#E6EAF2]">intelligent systems</span>.
                  Unlike developers who just focus on code syntax, I focus on the entire lifecycle of a problem—from the architecture diagram to the deployment pipeline.
                </p>
                <p className="text-lg text-[#9AA4BF] leading-relaxed">
                  I have built systems for agriculture, healthcare, and digital media. I am obsessed with optimization, clean data structures, and building tools that actually help people in the real world.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* --- TECHNICAL ARSENAL (SKILLS) --- */}
        <section id="skills" className="py-32 px-6 bg-[#0E121F]">
          <div className="container mx-auto max-w-6xl">
            <Reveal>
              <span className="text-[#38F2FF] font-mono text-sm tracking-widest uppercase mb-4 block">02 // Technical Arsenal</span>
              <h2 className="text-4xl font-bold text-[#E6EAF2] mb-16">LANGUAGES & TOOLS</h2>
            </Reveal>

            <div className="grid md:grid-cols-4 gap-8">
              {SKILLS.map((skillGroup, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="p-8 border border-white/5 bg-[#0B0F1A] rounded-xl hover:border-[#38F2FF]/30 transition-all h-full">
                    <h3 className="text-[#38F2FF] font-mono text-sm uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
                      {skillGroup.category}
                    </h3>
                    <ul className="space-y-3">
                      {skillGroup.items.map((item, idx) => (
                        <li key={idx} className="text-lg text-[#E6EAF2] flex items-center gap-3">
                          <span className="w-1.5 h-1.5 bg-[#9AA4BF] rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* --- ENGINEERING PRINCIPLES --- */}
        <section className="py-32 px-6">
          <div className="container mx-auto max-w-6xl">
            <Reveal>
              <h2 className="text-sm font-mono text-[#38F2FF] tracking-widest uppercase mb-12">Core Philosophy</h2>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-12">
              {PRINCIPLES.map((item, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="group">
                    <div className="mb-6 p-4 bg-[#12182B] w-fit rounded-lg border border-white/5 group-hover:border-[#38F2FF]/30 transition-colors">
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-[#E6EAF2] mb-4">{item.title}</h3>
                    <p className="text-[#9AA4BF] leading-relaxed text-lg">
                      {item.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* --- CASE STUDIES --- */}
        <section id="work" className="py-32 px-6 border-t border-white/5">
          <div className="container mx-auto max-w-6xl">
            <Reveal>
              <span className="text-[#38F2FF] font-mono text-sm tracking-widest uppercase mb-4 block">03 // Selected Works</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#E6EAF2] mb-24">SYSTEM CASE STUDIES</h2>
            </Reveal>

            <div className="space-y-32">
              {PROJECTS.map((project, index) => (
                <Reveal key={index} delay={0.1}>
                  <div className="grid md:grid-cols-12 gap-12 border-t border-white/10 pt-16 relative group">

                    {/* ID Number */}
                    <span className="absolute -top-10 left-0 text-[120px] font-bold text-white/[0.03] -z-10 select-none">
                      {project.id}
                    </span>

                    {/* Left: Title & Context */}
                    <div className="md:col-span-5 space-y-6">
                      <div>
                        <span className="text-sm font-mono text-[#38F2FF] uppercase tracking-wider">{project.role}</span>
                        <h3 className="text-4xl md:text-5xl font-bold text-[#E6EAF2] mt-3 mb-4">{project.title}</h3>
                        <p className="text-[#38F2FF] text-xl font-medium">{project.outcome}</p>
                      </div>

                      <div className="flex gap-4 pt-6">
                        <a href={project.link} target="_blank" className="px-6 py-3 border border-white/10 hover:bg-white hover:text-black hover:border-white transition-all rounded-lg flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[#E6EAF2]">
                          View System <ArrowUpRight className="w-5 h-5" />
                        </a>
                      </div>
                    </div>

                    {/* Right: The Deep Dive */}
                    <div className="md:col-span-7 space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                          <h4 className="text-sm font-mono text-[#9AA4BF] uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Shield className="w-4 h-4" /> The Constraint
                          </h4>
                          <p className="text-lg text-[#E6EAF2]/90 leading-relaxed border-l-2 border-[#38F2FF]/30 pl-5">
                            {project.constraint}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-mono text-[#9AA4BF] uppercase tracking-widest mb-4 flex items-center gap-2">
                            <GitBranch className="w-4 h-4" /> The Architecture
                          </h4>
                          <p className="text-lg text-[#E6EAF2]/90 leading-relaxed border-l-2 border-[#38F2FF]/30 pl-5">
                            {project.architecture}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4">
                        <h4 className="text-xs font-mono text-[#9AA4BF] uppercase mb-4 tracking-widest">Technology Stack</h4>
                        <div className="flex flex-wrap gap-3">
                          {project.tech.map(t => (
                            <span key={t} className="px-4 py-2 text-sm font-mono text-[#E6EAF2] bg-[#12182B] rounded border border-white/10">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* --- CONTACT --- */}
        <section id="contact" className="py-40 px-6 relative overflow-hidden bg-[#0B0F1A]">
          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <Reveal>
              <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-[#E6EAF2] mb-12">
                SYSTEMS READY.
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                <a href="mailto:arthonykanjira444@gmail.com" className="group p-10 border border-white/5 bg-[#12182B]/50 hover:bg-[#12182B] hover:border-[#38F2FF]/30 transition-all rounded-xl">
                  <Mail className="w-8 h-8 text-[#9AA4BF] mx-auto mb-6 group-hover:text-[#38F2FF]" />
                  <div className="text-sm font-mono uppercase tracking-widest text-[#9AA4BF]">Email Link</div>
                </a>
                <a href="https://github.com/AK47GT18" target="_blank" className="group p-10 border border-white/5 bg-[#12182B]/50 hover:bg-[#12182B] hover:border-[#38F2FF]/30 transition-all rounded-xl">
                  <Github className="w-8 h-8 text-[#9AA4BF] mx-auto mb-6 group-hover:text-[#38F2FF]" />
                  <div className="text-sm font-mono uppercase tracking-widest text-[#9AA4BF]">GitHub</div>
                </a>
                <a href="tel:+265885620896" className="group p-10 border border-white/5 bg-[#12182B]/50 hover:bg-[#12182B] hover:border-[#38F2FF]/30 transition-all rounded-xl">
                  <Phone className="w-8 h-8 text-[#9AA4BF] mx-auto mb-6 group-hover:text-[#38F2FF]" />
                  <div className="text-sm font-mono uppercase tracking-widest text-[#9AA4BF]">Phone</div>
                </a>
              </div>
            </Reveal>

            <footer className="flex flex-col md:flex-row justify-between items-center text-xs font-mono text-[#9AA4BF]/50 uppercase tracking-widest border-t border-white/5 pt-10">
              <span>Arthony Kanjira // 2025</span>
              <span>Status: Final Year // Open for Work</span>
              <span>Lilongwe, Malawi</span>
            </footer>
          </div>
        </section>

      </div>

      {/* --- AI TERMINAL --- */}
      {chatOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0B0F1A]/90 backdrop-blur-md"
        >
          <div className="bg-[#0B0F1A] w-full max-w-xl border border-white/10 shadow-[0_0_100px_rgba(56,242,255,0.05)] rounded-lg flex flex-col overflow-hidden h-[600px]">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#12182B]">
              <span className="font-mono text-xs text-[#38F2FF] tracking-widest">TERMINAL // ASSISTANT</span>
              <button onClick={() => setChatOpen(false)} className="text-[#9AA4BF] hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex-1 p-6 font-mono text-sm overflow-y-auto">
              <div className="mb-6">
                <span className="text-[#38F2FF] mr-2">➜</span>
                <span className="text-[#9AA4BF]">System initialized...</span>
              </div>
              <div className="bg-[#12182B]/50 p-6 border-l-2 border-[#38F2FF] text-[#E6EAF2] leading-relaxed rounded-r-lg">
                Hello. I am the portfolio assistant. I can explain the <span className="text-[#38F2FF]">offline-first architecture</span> of the Crop Advisory System or discuss how Arthony handles <span className="text-[#38F2FF]">database concurrency</span> in PHP.
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-[#0B0F1A]">
              <div className="flex gap-3">
                <span className="text-[#38F2FF] py-3">➜</span>
                <input type="text" placeholder="Enter query..." className="flex-1 bg-transparent border-none text-[#E6EAF2] font-mono text-sm focus:ring-0 placeholder-[#9AA4BF]/30" autoFocus />
                <button className="text-[#38F2FF] hover:text-white"><Send className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}