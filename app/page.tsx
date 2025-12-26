'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';
import { motion, useScroll, useTransform, AnimatePresence, MotionValue } from 'framer-motion';
import {
  ArrowUpRight, Github, Mail, Phone,
  Shield, Zap, Network, GitBranch,
  Send, X, Sun, Moon
} from 'lucide-react';

// --- ICONS DATA (Devicon) ---
const TECH_ICONS: Record<string, string> = {
  "Python": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  "PHP": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
  "JavaScript": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  "TypeScript": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  "C++": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
  "Next.js": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
  "React": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  "FastAPI": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg",
  "Tailwind": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  "Laravel": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg",
  "Docker": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
  "Linux": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg",
  "MySQL": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
  "PostgreSQL": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
  "Supabase": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg",
  "Git": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
  "Scikit-Learn": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg",
  "Pandas": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg"
};

const SKILLS = [
  { category: "Languages", items: ["Python", "PHP", "JavaScript", "TypeScript", "C++"] },
  { category: "Frameworks", items: ["Next.js", "React", "FastAPI", "Laravel", "Tailwind"] },
  { category: "Infrastructure", items: ["Docker", "Linux", "MySQL", "PostgreSQL", "Git"] },
  { category: "Intelligence", items: ["Scikit-Learn", "Pandas"] }
];

const PRINCIPLES = [
  {
    title: "Constraints First",
    desc: "I don't write a line of code until I understand the bandwidth, the data volume, and the user's hardware.",
    icon: <Shield className="w-6 h-6 text-[#38F2FF] dark:text-[#38F2FF] text-blue-600" />
  },
  {
    title: "Fault Tolerance",
    desc: "Happy paths are easy. I design for the 1% of the time when the API fails or the network drops.",
    icon: <Network className="w-6 h-6 text-[#38F2FF] dark:text-[#38F2FF] text-blue-600" />
  },
  {
    title: "Simplicity Scaling",
    desc: "Complexity is tech debt. I prefer a boring, robust solution over a clever, fragile one.",
    icon: <Zap className="w-6 h-6 text-[#38F2FF] dark:text-[#38F2FF] text-blue-600" />
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
    tech: ["PHP", "MySQL", "Tailwind"],
    link: "https://next-level.gt.tc",
    id: "02"
  },
  {
    title: "Voice of Livingstonia",
    role: "PLATFORM LEAD",
    outcome: "University-Wide Adoption",
    constraint: "Need for a censorship-resistant news platform that handles spikes in traffic during campus events.",
    architecture: "Custom CMS with optimized query caching. Decoupled frontend delivery from backend logic.",
    tech: ["PHP", "MySQL"],
    link: "https://github.com/AK47GT18/VoL-BEHIND-.git",
    id: "03"
  }
];

// --- SUB-COMPONENTS ---

// Fix: Extracting the animated number to its own component so Hooks work correctly
const ProjectNumber = ({ id, scrollYProgress }: { id: string, scrollYProgress: MotionValue<number> }) => {
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <motion.span
      style={{ y }}
      className="absolute -top-10 left-0 text-[120px] font-bold text-slate-900/[0.03] dark:text-white/[0.03] -z-10 select-none"
    >
      {id}
    </motion.span>
  );
};

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const bootLines = [
      "Initializing kernel...",
      "Loading Vanta.js modules...",
      "Decrypting portfolio data...",
      "Optimizing assets...",
      "System Ready."
    ];

    let lineIndex = 0;
    const lineInterval = setInterval(() => {
      if (lineIndex < bootLines.length) {
        setLines(prev => [...prev, bootLines[lineIndex]]);
        lineIndex++;
      }
    }, 400);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(lineInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => {
      clearInterval(progressInterval);
      clearInterval(lineInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center font-mono text-[#38F2FF]"
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="w-80 space-y-4">
        <div className="flex justify-between text-xs uppercase tracking-widest">
          <span>System Boot</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1 bg-[#38F2FF]/20 w-full overflow-hidden">
          <motion.div
            className="h-full bg-[#38F2FF]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="h-24 flex flex-col justify-end gap-1 overflow-hidden">
          {lines.map((line, i) => (
            <span key={i} className="text-[10px] text-[#9AA4BF]">{`> ${line}`}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Reveal = ({ children, delay = 0, width = "fit-content" }: { children: React.ReactNode, delay?: number, width?: "fit-content" | "100%" }) => (
  <motion.div
    style={{ width }}
    initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// --- MAIN COMPONENT ---

export default function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Handle Theme Toggle
  const toggleTheme = () => setDarkMode(!darkMode);

  // Vanta Effect with Dynamic Colors
  useEffect(() => {
    if (!loading && vantaRef.current) {
      if (vantaEffect) vantaEffect.destroy();

      setVantaEffect(NET({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true, touchControls: true, gyroControls: false,
        minHeight: 200.00, minWidth: 200.00,
        scale: 1.00, scaleMobile: 1.00,
        color: darkMode ? 0x38F2FF : 0x2563EB,
        backgroundColor: darkMode ? 0x0B0F1A : 0xF0F4F8,
        points: 9.00,
        maxDistance: 22.00,
        spacing: 18.00,
        showDots: true,
        backgroundAlpha: 1.0
      }));
    }
    return () => { if (vantaEffect) vantaEffect.destroy(); };
  }, [loading, darkMode]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <div className="relative min-h-screen bg-[#F0F4F8] dark:bg-[#0B0F1A] text-slate-800 dark:text-[#E6EAF2] font-sans selection:bg-blue-500 selection:text-white dark:selection:bg-[#38F2FF] dark:selection:text-[#0B0F1A] transition-colors duration-500 overflow-x-hidden">

          {/* Scroll Progress */}
          <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-[4px] bg-blue-600 dark:bg-[#38F2FF] origin-left z-[70]" />

          {/* Vanta Layer */}
          <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none opacity-30 dark:opacity-20" />

          {/* Vignette (Dark Mode Only) */}
          <div className="fixed inset-0 z-0 pointer-events-none dark:bg-[radial-gradient(circle_at_center,transparent_0%,#0B0F1A_120%)] transition-all duration-500" />

          <div className="relative z-10">

            {/* --- NAVBAR --- */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled
              ? 'bg-white/80 dark:bg-[#0B0F1A]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/5 py-4'
              : 'py-10 bg-transparent'
              }`}>
              <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="font-mono text-sm tracking-[0.2em] font-bold text-slate-900 dark:text-[#E6EAF2]">
                  ARTHONY<span className="text-blue-600 dark:text-[#38F2FF]">_KANJIRA</span>
                </div>

                <div className="hidden md:flex gap-12 text-xs font-bold tracking-widest text-slate-500 dark:text-[#9AA4BF]">
                  <a href="#about" className="hover:text-blue-600 dark:hover:text-white transition-colors">ABOUT</a>
                  <a href="#skills" className="hover:text-blue-600 dark:hover:text-white transition-colors">ARSENAL</a>
                  <a href="#work" className="hover:text-blue-600 dark:hover:text-white transition-colors">SYSTEMS</a>
                </div>

                <div className="flex items-center gap-6">
                  <button onClick={toggleTheme} className="text-slate-600 dark:text-[#9AA4BF] hover:text-blue-600 dark:hover:text-white transition-colors">
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => setChatOpen(true)}
                    className="text-blue-600 dark:text-[#38F2FF] text-xs uppercase font-bold tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-2 h-2 bg-blue-600 dark:bg-[#38F2FF] rounded-full animate-pulse" />
                    AI TERMINAL
                  </button>
                </div>
              </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="min-h-screen flex flex-col justify-center px-6 pt-20">
              <div className="container mx-auto max-w-5xl">
                <Reveal>
                  <div className="inline-block mb-8 px-4 py-2 border border-blue-600/20 dark:border-[#38F2FF]/20 rounded-full bg-blue-600/5 dark:bg-[#38F2FF]/5">
                    <span className="text-xs font-mono text-blue-600 dark:text-[#38F2FF] tracking-widest uppercase">Computer Engineering Finalist</span>
                  </div>
                </Reveal>

                <Reveal delay={0.1}>
                  <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[1.05] mb-8 text-slate-900 dark:text-[#E6EAF2]">
                    ENGINEERING SYSTEMS. <br />
                    <span className="text-slate-400 dark:text-[#9AA4BF]">BUILDING INTELLIGENCE.</span>
                  </h1>
                </Reveal>

                <Reveal delay={0.2}>
                  <div className="border-l-4 border-blue-600 dark:border-[#38F2FF] pl-8 max-w-3xl">
                    <p className="text-2xl md:text-3xl text-slate-700 dark:text-[#E6EAF2] font-light leading-relaxed">
                      I design software that survives bad data, weak networks, and real users.
                    </p>
                  </div>
                </Reveal>
              </div>

              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute bottom-12 left-6 text-slate-400 dark:text-[#9AA4BF] text-xs font-mono tracking-widest rotate-90 origin-left"
              >
                SCROLL TO DECRYPT
              </motion.div>
            </section>

            {/* --- ABOUT ME (THE OPERATOR) --- */}
            <section id="about" className="py-32 px-6 border-t border-slate-200 dark:border-white/5 bg-white/50 dark:bg-[#0B0F1A]/80 backdrop-blur-sm">
              <div className="container mx-auto max-w-5xl grid md:grid-cols-12 gap-16 items-start">
                <div className="md:col-span-4">
                  <Reveal>
                    <span className="text-blue-600 dark:text-[#38F2FF] font-mono text-sm tracking-widest uppercase mb-4 block">01 // The Operator</span>
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-[#E6EAF2]">WHO I AM</h2>
                  </Reveal>
                </div>
                <div className="md:col-span-8 space-y-8">
                  <Reveal delay={0.2}>
                    <p className="text-xl md:text-2xl text-slate-600 dark:text-[#9AA4BF] leading-relaxed">
                      I am <strong className="text-slate-900 dark:text-[#E6EAF2]">Arthony Kanjira</strong>, a final year Computer Engineering student based in Malawi.
                    </p>
                    <p className="text-lg text-slate-600 dark:text-[#9AA4BF] leading-relaxed">
                      My work sits at the intersection of <span className="text-slate-900 dark:text-[#E6EAF2] border-b border-blue-600/30 dark:border-[#38F2FF]/30">software engineering</span> and <span className="text-slate-900 dark:text-[#E6EAF2] border-b border-blue-600/30 dark:border-[#38F2FF]/30">intelligent systems</span>.
                      Unlike developers who just focus on code syntax, I focus on the entire lifecycle of a problem—from the architecture diagram to the deployment pipeline.
                    </p>
                  </Reveal>
                </div>
              </div>
            </section>

            {/* --- TECHNICAL ARSENAL (ICONS GRID) --- */}
            <section id="skills" className="py-32 px-6 bg-slate-100 dark:bg-[#0E121F] transition-colors duration-500">
              <div className="container mx-auto max-w-6xl">
                <Reveal>
                  <span className="text-blue-600 dark:text-[#38F2FF] font-mono text-sm tracking-widest uppercase mb-4 block">02 // Technical Arsenal</span>
                  <h2 className="text-4xl font-bold text-slate-900 dark:text-[#E6EAF2] mb-16">LANGUAGES & TOOLS</h2>
                </Reveal>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {SKILLS.map((skillGroup, i) => (
                    <Reveal key={i} delay={i * 0.1} width="100%">
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="p-8 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0B0F1A] rounded-xl hover:shadow-xl dark:hover:border-[#38F2FF]/30 transition-all h-full"
                      >
                        <h3 className="text-blue-600 dark:text-[#38F2FF] font-mono text-xs uppercase tracking-widest mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                          {skillGroup.category}
                        </h3>
                        <div className="grid grid-cols-3 gap-6">
                          {skillGroup.items.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
                              {TECH_ICONS[item] ? (
                                <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                                  <img
                                    src={TECH_ICONS[item]}
                                    alt={item}
                                    className="w-full h-full object-contain filter dark:brightness-100"
                                  />
                                </div>
                              ) : (
                                <div className="w-10 h-10 bg-slate-200 dark:bg-white/10 rounded-full flex items-center justify-center">
                                  <span className="text-[10px] font-bold">{item[0]}</span>
                                </div>
                              )}
                              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-[#9AA4BF] opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4 bg-black/80 text-white px-2 py-1 rounded whitespace-nowrap z-10">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* --- ENGINEERING PRINCIPLES --- */}
            <section className="py-32 px-6">
              <div className="container mx-auto max-w-6xl">
                <Reveal>
                  <h2 className="text-sm font-mono text-blue-600 dark:text-[#38F2FF] tracking-widest uppercase mb-12">Core Philosophy</h2>
                </Reveal>

                <div className="grid md:grid-cols-3 gap-12">
                  {PRINCIPLES.map((item, i) => (
                    <Reveal key={i} delay={i * 0.1}>
                      <div className="group">
                        <div className="mb-6 p-4 bg-white dark:bg-[#12182B] w-fit rounded-lg border border-slate-200 dark:border-white/5 group-hover:border-blue-600/30 dark:group-hover:border-[#38F2FF]/30 transition-colors shadow-sm">
                          {item.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-[#E6EAF2] mb-4">{item.title}</h3>
                        <p className="text-slate-600 dark:text-[#9AA4BF] leading-relaxed text-lg">
                          {item.desc}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* --- CASE STUDIES --- */}
            <section id="work" className="py-32 px-6 border-t border-slate-200 dark:border-white/5">
              <div className="container mx-auto max-w-6xl">
                <Reveal>
                  <span className="text-blue-600 dark:text-[#38F2FF] font-mono text-sm tracking-widest uppercase mb-4 block">03 // Selected Works</span>
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-[#E6EAF2] mb-24">SYSTEM CASE STUDIES</h2>
                </Reveal>

                <div className="space-y-32">
                  {PROJECTS.map((project, index) => (
                    <Reveal key={index} delay={0.1}>
                      <div className="grid md:grid-cols-12 gap-12 border-t border-slate-200 dark:border-white/10 pt-16 relative group">

                        {/* Parallax ID Number using new component */}
                        <ProjectNumber id={project.id} scrollYProgress={scrollYProgress} />

                        {/* Left: Title & Context */}
                        <div className="md:col-span-5 space-y-6">
                          <div>
                            <span className="text-sm font-mono text-blue-600 dark:text-[#38F2FF] uppercase tracking-wider">{project.role}</span>
                            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-[#E6EAF2] mt-3 mb-4">{project.title}</h3>
                            <p className="text-blue-600 dark:text-[#38F2FF] text-xl font-medium">{project.outcome}</p>
                          </div>

                          <div className="flex gap-4 pt-6">
                            <a href={project.link} target="_blank" className="px-6 py-3 border border-slate-300 dark:border-white/10 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all rounded-lg flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-[#E6EAF2]">
                              View System <ArrowUpRight className="w-5 h-5" />
                            </a>
                          </div>
                        </div>

                        {/* Right: The Deep Dive */}
                        <div className="md:col-span-7 space-y-10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                              <h4 className="text-sm font-mono text-slate-500 dark:text-[#9AA4BF] uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Shield className="w-4 h-4" /> The Constraint
                              </h4>
                              <p className="text-lg text-slate-700 dark:text-[#E6EAF2]/90 leading-relaxed border-l-2 border-blue-600/30 dark:border-[#38F2FF]/30 pl-5">
                                {project.constraint}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-mono text-slate-500 dark:text-[#9AA4BF] uppercase tracking-widest mb-4 flex items-center gap-2">
                                <GitBranch className="w-4 h-4" /> The Architecture
                              </h4>
                              <p className="text-lg text-slate-700 dark:text-[#E6EAF2]/90 leading-relaxed border-l-2 border-blue-600/30 dark:border-[#38F2FF]/30 pl-5">
                                {project.architecture}
                              </p>
                            </div>
                          </div>

                          <div className="pt-4">
                            <h4 className="text-xs font-mono text-slate-400 dark:text-[#9AA4BF] uppercase mb-4 tracking-widest">Technology Stack</h4>
                            <div className="flex flex-wrap gap-3">
                              {project.tech.map(t => (
                                <span key={t} className="px-4 py-2 text-sm font-mono text-slate-600 dark:text-[#E6EAF2] bg-slate-200 dark:bg-[#12182B] rounded border border-slate-300 dark:border-white/10 flex items-center gap-2">
                                  {TECH_ICONS[t] && <img src={TECH_ICONS[t]} alt="" className="w-4 h-4" />}
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
            <section id="contact" className="py-40 px-6 relative overflow-hidden bg-slate-100 dark:bg-[#0B0F1A] transition-colors duration-500">
              <div className="container mx-auto max-w-4xl text-center relative z-10">
                <Reveal>
                  <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-slate-900 dark:text-[#E6EAF2] mb-12">
                    SYSTEMS READY.
                  </h2>
                </Reveal>

                <Reveal delay={0.2}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                    <a href="mailto:arthonykanjira444@gmail.com" className="group p-10 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#12182B]/50 hover:shadow-2xl hover:-translate-y-1 dark:hover:bg-[#12182B] dark:hover:border-[#38F2FF]/30 transition-all rounded-xl">
                      <Mail className="w-8 h-8 text-slate-400 dark:text-[#9AA4BF] mx-auto mb-6 group-hover:text-blue-600 dark:group-hover:text-[#38F2FF]" />
                      <div className="text-sm font-mono uppercase tracking-widest text-slate-500 dark:text-[#9AA4BF]">Email Link</div>
                    </a>
                    <a href="https://github.com/AK47GT18" target="_blank" className="group p-10 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#12182B]/50 hover:shadow-2xl hover:-translate-y-1 dark:hover:bg-[#12182B] dark:hover:border-[#38F2FF]/30 transition-all rounded-xl">
                      <Github className="w-8 h-8 text-slate-400 dark:text-[#9AA4BF] mx-auto mb-6 group-hover:text-blue-600 dark:group-hover:text-[#38F2FF]" />
                      <div className="text-sm font-mono uppercase tracking-widest text-slate-500 dark:text-[#9AA4BF]">GitHub</div>
                    </a>
                    <a href="tel:+265885620896" className="group p-10 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#12182B]/50 hover:shadow-2xl hover:-translate-y-1 dark:hover:bg-[#12182B] dark:hover:border-[#38F2FF]/30 transition-all rounded-xl">
                      <Phone className="w-8 h-8 text-slate-400 dark:text-[#9AA4BF] mx-auto mb-6 group-hover:text-blue-600 dark:group-hover:text-[#38F2FF]" />
                      <div className="text-sm font-mono uppercase tracking-widest text-slate-500 dark:text-[#9AA4BF]">Phone</div>
                    </a>
                  </div>
                </Reveal>

                <footer className="flex flex-col md:flex-row justify-between items-center text-xs font-mono text-slate-400 dark:text-[#9AA4BF]/50 uppercase tracking-widest border-t border-slate-200 dark:border-white/5 pt-10">
                  <span>Arthony Kanjira // 2025</span>
                  <span>Status: Final Year // Open for Work</span>
                  <span>Mzuzu, Malawi</span>
                </footer>
              </div>
            </section>

          </div>

          {/* --- AI TERMINAL --- */}
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            >
              <div className="bg-white dark:bg-[#0B0F1A] w-full max-w-xl border border-slate-200 dark:border-white/10 shadow-2xl dark:shadow-[0_0_100px_rgba(56,242,255,0.05)] rounded-lg flex flex-col overflow-hidden h-[600px]">
                <div className="p-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-[#12182B]">
                  <span className="font-mono text-xs text-blue-600 dark:text-[#38F2FF] tracking-widest">TERMINAL // ASSISTANT</span>
                  <button onClick={() => setChatOpen(false)} className="text-slate-500 hover:text-red-500 dark:text-[#9AA4BF] dark:hover:text-white"><X className="w-4 h-4" /></button>
                </div>

                <div className="flex-1 p-6 font-mono text-sm overflow-y-auto">
                  <div className="mb-6">
                    <span className="text-blue-600 dark:text-[#38F2FF] mr-2">➜</span>
                    <span className="text-slate-500 dark:text-[#9AA4BF]">System initialized...</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-[#12182B]/50 p-6 border-l-2 border-blue-600 dark:border-[#38F2FF] text-slate-800 dark:text-[#E6EAF2] leading-relaxed rounded-r-lg">
                    Hello. I am the portfolio assistant. I can explain the <span className="text-blue-600 dark:text-[#38F2FF]">offline-first architecture</span> of the Crop Advisory System or discuss how Arthony handles <span className="text-blue-600 dark:text-[#38F2FF]">database concurrency</span> in PHP.
                  </div>
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B0F1A]">
                  <div className="flex gap-3">
                    <span className="text-blue-600 dark:text-[#38F2FF] py-3">➜</span>
                    <input type="text" placeholder="Enter query..." className="flex-1 bg-transparent border-none text-slate-900 dark:text-[#E6EAF2] font-mono text-sm focus:ring-0 placeholder-slate-400 dark:placeholder-[#9AA4BF]/30" autoFocus />
                    <button className="text-blue-600 dark:text-[#38F2FF] hover:opacity-80"><Send className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      )}
    </div>
  );
}