'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import NET from 'vanta/dist/vanta.net.min';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, useScroll, useTransform, AnimatePresence, MotionValue, useInView } from 'framer-motion';
import {
  ArrowUpRight, Github, Mail, Phone,
  Shield, Zap, Network, GitBranch,
  Send, X, Sun, Moon, MessageCircle, Terminal
} from 'lucide-react';

// --- DATA CONSTANTS ---

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

const ARTHONY_DATA = {
  "systemInstruction": "You are an AI portfolio assistant for Arthony Kanjira, a Computer Engineering finalist. Your role is to provide concise, technical, and accurate information about his projects, skills, experience, and professional details. Only provide information directly related to him; do not answer unrelated questions. If asked trivial questions (like '1+1') or anything unrelated, redirect politely, stating your job is to provide information about Arthony only.",
  "profile": {
    "name": "Arthony Kanjira",
    "phone": "+265885620896",
    "email": "arthontkanjira444@gmail.com",
    "education": "Final year, BSc Computer Engineering, University of Livingstonia",
    "skills": {
      "languages": ["Python", "PHP", "Java", "C", "C++", "JavaScript", "HTML", "CSS", "XML"],
      "frameworks": ["React", "Next.js", "Tailwind CSS", "Node.js"],
      "databases": ["MySQL", "PostgreSQL", "Supabase"],
      "tools": ["Docker", "Git", "Linux"],
      "other": ["3D graphics with Three.js", "Canvas API", "AI model integration", "Payment systems"]
    },
    "projects": [
      {
        "name": "Crop Advisory App",
        "description": "A smart AI-driven agriculture assistant, predicting yields and detecting pests with surgical precision. Weather API integration ensures farmers get live, actionable insights.",
        "stack": ["Python", "React", "Node.js", "PostgreSQL", "Tailwind CSS", "JavaScript"],
        "notes": "Full-stack AI integration; a farmer’s secret weapon."
      },
      {
        "name": "Pharma-Core (Pharmacy Management System)",
        "description": "Sleek, secure, and efficient pharmacy management. Handles inventory, sales, and users while gracefully integrating payment gateways.",
        "stack": ["Python", "PHP", "Node.js", "MySQL", "React", "Tailwind CSS"],
        "notes": "Streamlined operations for pharmacies, production-ready."
      },
      {
        "name": "Local News Website",
        "description": "A clean, responsive hub delivering timely news. Engages readers while managing content seamlessly in the cloud.",
        "stack": ["HTML", "CSS", "JavaScript", "Tailwind CSS", "React", "Node.js", "Supabase"],
        "notes": "Modern full-stack approach, fully mobile-ready."
      },
      {
        "name": "Car Booking Application",
        "description": "Effortless ride-booking platform with instant confirmations and secure payments. Sleek UX keeps users coming back.",
        "stack": ["React", "PHP", "Node.js", "MySQL", "Tailwind CSS"],
        "notes": "Full-stack app; optimized for speed and reliability."
      },
      {
        "name": "E-commerce App",
        "description": "Shopping made simple. Java & XML power a robust Android platform with smooth cart and order management.",
        "stack": ["Java", "XML", "SQLite", "Node.js"],
        "notes": "Responsive, mobile-first design with intuitive flows."
      },
      {
        "name": "Lost and Found Website (Unilia)",
        "description": "Quickly post or locate lost items. Elegant design meets cloud storage for instant tracking.",
        "stack": ["HTML", "CSS", "JavaScript", "Node.js", "Supabase", "GitHub Pages"],
        "notes": "Lightweight, modern, and super accessible."
      },
      {
        "name": "3D Racing Game",
        "description": "High-octane 3D racing fun using Three.js. Realistic physics and immersive tracks for an adrenaline rush.",
        "stack": ["Three.js", "HTML", "CSS", "JavaScript", "Node.js"],
        "notes": "Interactive 3D gameplay; browser-ready excitement."
      },
      {
        "name": "Flappy Bird Clone",
        "description": "Classic arcade joy, cloned with canvas API and custom physics. Addictive gameplay, minimal footprint.",
        "stack": ["JavaScript", "Canvas API", "HTML", "CSS", "Node.js"],
        "notes": "Perfect blend of nostalgia and web tech."
      },
      {
        "name": "Voice-to-Speech PC Controller",
        "description": "Command your PC with your voice. AI-powered speech recognition translates words into seamless system actions.",
        "stack": ["Python", "JavaScript", "Node.js", "API integrations"],
        "notes": "Futuristic interaction meets practical utility."
      }
    ],
    "experience": [
      "Full-stack development with AI integration",
      "Payment system architecture and deployment",
      "Software architecture and security considerations",
      "Cross-platform web and game development"
    ],
    "responseConstraints": {
      "tone": "Technical, concise, helpful, ≤80 words per response, forward-thinking, practical; subtle playful or lyrical touches allowed.",
      "rules": [
        "Do not provide speculative answers",
        "Do not answer unrelated questions",
        "Redirect trivial questions politely to Arthony-related info only"
      ]
    }
  }
};

// --- ANIMATION COMPONENTS ---

const Reveal = ({ children, delay = 0, width = "fit-content" }: { children: React.ReactNode, delay?: number, width?: "fit-content" | "100%" }) => (
  <motion.div
    style={{ width }}
    initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: false, margin: "-10% 0px -10% 0px" }}
    transition={{ duration: 0.8, delay, ease: [0.25, 0.25, 0, 1] }}
  >
    {children}
  </motion.div>
);

const Typewriter = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isInView) {
      setDisplayedText("");
      let currentIndex = 0;

      const typeChar = () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          timeout = setTimeout(typeChar, 30 + Math.random() * 30);
        }
      };
      timeout = setTimeout(typeChar, delay * 1000);
    } else {
      setDisplayedText("");
    }

    return () => clearTimeout(timeout);
  }, [isInView, text, delay]);

  return <span ref={ref} className={className}>{displayedText}</span>;
};

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

const ProjectCard = ({ project, scrollYProgress }: { project: any, scrollYProgress: any }) => {
  return (
    <Reveal width="100%">
      <div className="grid md:grid-cols-12 gap-12 border-t border-slate-200 dark:border-white/10 pt-16 relative group">
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
              Explore Project <ArrowUpRight className="w-5 h-5" />
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
              {project.tech.map((t: string) => (
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
  );
};

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const bootLines = ["Initializing kernel...", "Loading Vanta.js modules...", "Decrypting portfolio data...", "System Ready."];
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

    return () => { clearInterval(progressInterval); clearInterval(lineInterval); };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center font-mono text-[#38F2FF]"
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="w-80 space-y-4">
        <div className="flex justify-between text-xs uppercase tracking-widest"><span>System Boot</span><span>{progress}%</span></div>
        <div className="h-1 bg-[#38F2FF]/20 w-full overflow-hidden"><motion.div className="h-full bg-[#38F2FF]" style={{ width: `${progress}%` }} /></div>
        <div className="h-24 flex flex-col justify-end gap-1 overflow-hidden">{lines.map((line, i) => <span key={i} className="text-[10px] text-[#9AA4BF]">{`> ${line}`}</span>)}</div>
      </div>
    </motion.div>
  );
};

// --- CHAT INTERFACE COMPONENT (GOOGLE GEMINI - FRONTEND VERSION) ---
interface Message {
  role: 'user' | 'bot';
  text: string;
}

const ChatInterface = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Terminal initialized. Neural link established. How can I assist you with Arthony\'s portfolio today?' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      if (!apiKey) throw new Error("API Key missing");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash", // Using 1.5 flash for stability and speed
        systemInstruction: `${ARTHONY_DATA.systemInstruction}\n\nHere is Arthony's detailed profile: ${JSON.stringify(ARTHONY_DATA.profile)}\n\nConstraints: ${JSON.stringify(ARTHONY_DATA.profile.responseConstraints)}`
      });

      const result = await model.generateContent(userMsg);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'bot', text: text }]);
    } catch (error: any) {
      console.error("Gemini Error:", error);
      let errorMessage = "Neural link unstable. Please retry.";
      if (error.message.includes("API Key")) errorMessage = "System Error: Authentication failed.";
      if (error.message.includes("safety")) errorMessage = "System Error: Response scrubbed by safety protocols.";
      setMessages(prev => [...prev, { role: 'bot', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#0B0F1A]/90 w-full max-w-2xl border border-[#38F2FF]/20 shadow-[0_0_50px_rgba(56,242,255,0.1)] rounded-xl flex flex-col overflow-hidden h-[700px] relative"
      >
        {/* Subtle Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] z-50"></div>

        {/* Header */}
        <div className="p-4 border-b border-[#38F2FF]/10 flex justify-between items-center bg-[#12182B]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Terminal className="w-5 h-5 text-[#38F2FF]" />
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#38F2FF] tracking-[0.3em] uppercase opacity-70">A.K. Intelligence</span>
              <span className="font-mono text-xs text-[#E6EAF2] font-bold">PORTFOLIO_V2.5.EXE</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
          >
            <X className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 p-6 font-mono text-sm overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-[#38F2FF]/20">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] relative ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`p-4 rounded-xl leading-relaxed relative z-10 ${msg.role === 'user'
                  ? 'bg-[#38F2FF] text-[#0B0F1A] shadow-[0_4px_15px_rgba(56,242,255,0.3)]'
                  : 'bg-[#12182B] border-l-2 border-[#38F2FF] text-[#E6EAF2] shadow-xl'
                  }`}>
                  <span className="block text-[9px] opacity-40 mb-2 uppercase tracking-widest font-bold">
                    {msg.role === 'user' ? 'Operator' : 'AI_System'}
                  </span>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
                {/* Glow effect for bot messages */}
                {msg.role === 'bot' && (
                  <div className="absolute inset-0 bg-[#38F2FF]/5 blur-xl -z-0 rounded-full"></div>
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-[#12182B] border-l-2 border-[#38F2FF] p-4 rounded-r-xl flex items-center gap-3">
                <div className="flex gap-1">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-[#38F2FF] rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#38F2FF] rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#38F2FF] rounded-full" />
                </div>
                <span className="text-[10px] text-[#38F2FF] uppercase tracking-widest animate-pulse font-bold">Processing Query...</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-[#38F2FF]/10 bg-[#0B0F1A]">
          <div className="relative flex items-center group">
            <span className="absolute left-4 text-[#38F2FF] font-bold group-focus-within:animate-pulse">➜</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Query Arthony's intelligence..."
              className="w-full bg-[#12182B] border border-[#38F2FF]/10 text-[#E6EAF2] font-mono text-sm py-4 pl-10 pr-16 rounded-lg focus:outline-none focus:border-[#38F2FF]/50 focus:shadow-[0_0_15px_rgba(56,242,255,0.1)] transition-all placeholder-[#E6EAF2]/20 shadow-inner"
              autoFocus
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-3 p-2 bg-[#38F2FF] text-[#0B0F1A] rounded md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-[0_0_10px_rgba(56,242,255,0.4)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 flex justify-between px-2">
            <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Secure Uplink: Active</span>
            <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">End_of_Transmission</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};


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

  const toggleTheme = () => setDarkMode(!darkMode);

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
        points: 9.00, maxDistance: 22.00, spacing: 18.00, showDots: true, backgroundAlpha: 1.0
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

          <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-[4px] bg-blue-600 dark:bg-[#38F2FF] origin-left z-[70]" />
          <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none opacity-30 dark:opacity-20" />
          <div className="fixed inset-0 z-0 pointer-events-none dark:bg-[radial-gradient(circle_at_center,transparent_0%,#0B0F1A_120%)] transition-all duration-500" />

          <div className="relative z-10">
            {/* --- NAVBAR --- */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled ? 'bg-white/80 dark:bg-[#0B0F1A]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/5 py-4' : 'py-10 bg-transparent'}`}>
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
                  <button onClick={() => setChatOpen(true)} className="text-blue-600 dark:text-[#38F2FF] text-xs uppercase font-bold tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity">
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

                <div className="min-h-[160px] md:min-h-[240px]">
                  <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[1.05] mb-8 text-slate-900 dark:text-[#E6EAF2]">
                    <Typewriter text="ENGINEERING SYSTEMS." delay={0.2} /> <br />
                    <span className="text-slate-400 dark:text-[#9AA4BF]">
                      <Typewriter text="BUILDING INTELLIGENCE." delay={1.2} />
                    </span>
                  </h1>
                </div>

                <Reveal delay={2.0}>
                  <div className="border-l-4 border-blue-600 dark:border-[#38F2FF] pl-8 max-w-3xl">
                    <p className="text-2xl md:text-3xl text-slate-700 dark:text-[#E6EAF2] font-light leading-relaxed">
                      I design software that survives bad data, weak networks, and real users.
                    </p>
                  </div>
                </Reveal>
              </div>
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute bottom-12 left-6 text-slate-400 dark:text-[#9AA4BF] text-xs font-mono tracking-widest rotate-90 origin-left">SCROLL TO DECRYPT</motion.div>
            </section>

            {/* --- ABOUT ME --- */}
            <section id="about" className="py-32 px-6 border-t border-slate-200 dark:border-white/5 bg-white/50 dark:bg-[#0B0F1A]/80 backdrop-blur-sm">
              <div className="container mx-auto max-w-5xl grid md:grid-cols-12 gap-16 items-start">
                <div className="md:col-span-4">
                  <Reveal>
                    <span className="text-blue-600 dark:text-[#38F2FF] font-mono text-sm tracking-widest uppercase mb-4 block">01 // The Operator</span>
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-[#E6EAF2] h-[40px]">
                      <Typewriter text="WHO I AM" delay={0.1} />
                    </h2>
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

            {/* --- SKILLS --- */}
            <section id="skills" className="py-32 px-6 bg-slate-100 dark:bg-[#0E121F] transition-colors duration-500">
              <div className="container mx-auto max-w-6xl">
                <Reveal>
                  <span className="text-blue-600 dark:text-[#38F2FF] font-mono text-sm tracking-widest uppercase mb-4 block">02 // Technical Arsenal</span>
                  <h2 className="text-4xl font-bold text-slate-900 dark:text-[#E6EAF2] mb-16">
                    <Typewriter text="LANGUAGES & TOOLS" delay={0.1} />
                  </h2>
                </Reveal>

                {/* Staggered Grid Animation */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: "-10%" }}
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                  className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                  {SKILLS.map((skillGroup, i) => (
                    <motion.div
                      key={i}
                      variants={{
                        hidden: { opacity: 0, y: 50 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                      }}
                    >
                      <div className="p-8 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0B0F1A] rounded-xl hover:shadow-xl dark:hover:border-[#38F2FF]/30 transition-all h-full">
                        <h3 className="text-blue-600 dark:text-[#38F2FF] font-mono text-xs uppercase tracking-widest mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                          {skillGroup.category}
                        </h3>
                        <div className="grid grid-cols-3 gap-6">
                          {skillGroup.items.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
                              {TECH_ICONS[item] ? (
                                <img src={TECH_ICONS[item]} alt={item} className="w-10 h-10 object-contain filter dark:brightness-100 transition-transform group-hover:scale-110" />
                              ) : (
                                <div className="w-10 h-10 bg-slate-200 dark:bg-white/10 rounded-full flex items-center justify-center"><span className="text-[10px] font-bold">{item[0]}</span></div>
                              )}
                              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-[#9AA4BF] opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4 bg-black/80 text-white px-2 py-1 rounded whitespace-nowrap z-10">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* --- PRINCIPLES --- */}
            <section className="py-32 px-6">
              <div className="container mx-auto max-w-6xl">
                <Reveal>
                  <h2 className="text-sm font-mono text-blue-600 dark:text-[#38F2FF] tracking-widest uppercase mb-12">Core Philosophy</h2>
                </Reveal>
                <div className="grid md:grid-cols-3 gap-12">
                  {PRINCIPLES.map((item, i) => (
                    <Reveal key={i} delay={i * 0.1}>
                      <div className="group">
                        <div className="mb-6 p-4 bg-white dark:bg-[#12182B] w-fit rounded-lg border border-slate-200 dark:border-white/5 group-hover:border-blue-600/30 dark:group-hover:border-[#38F2FF]/30 transition-colors shadow-sm">{item.icon}</div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-[#E6EAF2] mb-4">{item.title}</h3>
                        <p className="text-slate-600 dark:text-[#9AA4BF] leading-relaxed text-lg">{item.desc}</p>
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
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-[#E6EAF2] mb-24">
                    <Typewriter text="SYSTEM CASE STUDIES" delay={0.1} />
                  </h2>
                </Reveal>
                <div className="space-y-32">
                  {PROJECTS.map((project, index) => (
                    <ProjectCard key={index} project={project} scrollYProgress={scrollYProgress} />
                  ))}
                </div>
              </div>
            </section>

            {/* --- CONTACT --- */}
            <section id="contact" className="py-40 px-6 relative overflow-hidden bg-slate-100 dark:bg-[#0B0F1A] transition-colors duration-500">
              <div className="container mx-auto max-w-4xl text-center relative z-10">
                <Reveal>
                  <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-slate-900 dark:text-[#E6EAF2] mb-12">
                    <Typewriter text="SYSTEMS READY." delay={0.1} />
                  </h2>
                </Reveal>

                {/* Fixed Grid Layout for Buttons */}
                <Reveal delay={0.2} width="100%">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 max-w-4xl mx-auto">

                    <a href="mailto:arthonykanjira444@gmail.com" className="group flex flex-col items-center p-10 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#12182B]/50 hover:shadow-2xl hover:-translate-y-1 dark:hover:bg-[#12182B] dark:hover:border-[#38F2FF]/30 transition-all rounded-xl h-full">
                      <Mail className="w-8 h-8 text-slate-400 dark:text-[#9AA4BF] mb-6 group-hover:text-blue-600 dark:group-hover:text-[#38F2FF]" />
                      <div className="text-sm font-mono uppercase tracking-widest text-slate-500 dark:text-[#9AA4BF]">Email Link</div>
                    </a>

                    <a href="https://github.com/AK47GT18" target="_blank" className="group flex flex-col items-center p-10 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#12182B]/50 hover:shadow-2xl hover:-translate-y-1 dark:hover:bg-[#12182B] dark:hover:border-[#38F2FF]/30 transition-all rounded-xl h-full">
                      <Github className="w-8 h-8 text-slate-400 dark:text-[#9AA4BF] mb-6 group-hover:text-blue-600 dark:group-hover:text-[#38F2FF]" />
                      <div className="text-sm font-mono uppercase tracking-widest text-slate-500 dark:text-[#9AA4BF]">GitHub</div>
                    </a>

                    <a href="https://wa.me/265885620896" target="_blank" className="group flex flex-col items-center p-10 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#12182B]/50 hover:shadow-2xl hover:-translate-y-1 dark:hover:bg-[#12182B] dark:hover:border-[#38F2FF]/30 transition-all rounded-xl h-full">
                      <MessageCircle className="w-8 h-8 text-slate-400 dark:text-[#9AA4BF] mb-6 group-hover:text-green-500 dark:group-hover:text-[#25D366]" />
                      <div className="text-sm font-mono uppercase tracking-widest text-slate-500 dark:text-[#9AA4BF]">WhatsApp</div>
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

          {/* --- AI TERMINAL OVERLAY --- */}
          <AnimatePresence>
            {chatOpen && <ChatInterface onClose={() => setChatOpen(false)} />}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}