import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, Cpu, Bot, CircuitBoard, 
  Terminal, Globe, Award, Focus, Binary, Zap,
  ExternalLink, FileText, MapPin, GraduationCap, BarChart
} from 'lucide-react';

// Custom Github Icon SVG to replace the removed Lucide brand icon
const GithubIcon = ({ className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
  </svg>
);

// --- ADVANCED ANIMATION HOOKS ---
const useScrollReveal = (threshold = 0.05) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold, rootMargin: '0px 0px -5% 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

// --- COMPONENTS ---

const FadeReveal = ({ children, delay = 0, className = "", direction = "up" }) => {
  const [ref, isVisible] = useScrollReveal();
  const translates = {
    up: "translate-y-12",
    down: "-translate-y-12",
    left: "translate-x-12",
    right: "-translate-x-12",
    none: "translate-y-0 translate-x-0 scale-95"
  };

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
        isVisible ? 'opacity-100 translate-y-0 translate-x-0 scale-100' : `opacity-0 ${translates[direction]}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Advanced Scrambling Text Effect for the Hero
const ScrambleHeading = ({ text, delay = 0, className = "" }) => {
  const [displayText, setDisplayText] = useState(text.replace(/./g, ' '));
  const [ref, isVisible] = useScrollReveal();
  const chars = '!<>-_\\/[]{}—=+*^?#________';

  useEffect(() => {
    if (!isVisible) return;
    
    let iteration = 0;
    let interval = null;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setDisplayText(text.split('').map((char, index) => {
          if (index < iteration) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join(''));

        if (iteration >= text.length) clearInterval(interval);
        iteration += 1 / 2; // Speed of decryption
      }, 30);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay, isVisible]);

  return (
    <span ref={ref} className={`block ${className}`}>
      {displayText}
    </span>
  );
};

// Project Card with the Hover-Swap Effect & Interactive Links
const HoverProjectCard = ({ project, index }) => {
  return (
    <FadeReveal delay={(index % 3) * 100} className="h-full">
      <div className="relative h-[360px] bg-[#0a0a0c] border border-zinc-800 group overflow-hidden cursor-none interactive-element">
        
        {/* FRONT STATE (Default) */}
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-0 group-hover:scale-95 group-hover:-translate-y-8 bg-[#0a0a0c]">
          <div>
            <span className="font-mono text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full"></span>
              {project.id} // {project.type}
            </span>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white mt-4 leading-[1.1]">
              {project.title}
            </h3>
          </div>
          <div className="flex flex-col gap-3">
             <div className="font-mono text-[10px] text-[#ccff00] uppercase tracking-widest flex items-center gap-2">
              <Focus className="w-4 h-4 animate-pulse" /> Hover to decrypt & view links
            </div>
            {/* Impact Sneak Peek */}
            {project.impact && (
              <div className="font-mono text-[9px] text-zinc-400 bg-zinc-900 border border-zinc-800 p-2 border-l-2 border-l-[#ccff00]">
                {project.impact}
              </div>
            )}
          </div>
        </div>

        {/* BACK STATE (Hover) */}
        <div className="absolute inset-0 p-6 md:p-8 bg-[#ccff00] flex flex-col justify-between z-20 opacity-0 translate-y-12 scale-105 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100">
          <div>
            <h4 className="font-black text-black uppercase tracking-tighter text-xl mb-3 leading-tight">{project.title}</h4>
            <p className="text-black/80 font-medium text-xs md:text-sm leading-relaxed mb-4">
              {project.desc}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.specs.map(spec => (
                <span key={spec} className="px-2 py-1 text-[9px] md:text-[10px] font-mono border border-black/20 text-black uppercase tracking-widest bg-black/5">
                  {spec}
                </span>
              ))}
            </div>
          </div>
          
          {/* Action Links Container (Clickable) */}
          <div className="flex items-center gap-3 relative z-30 pointer-events-auto">
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest border-2 border-black px-3 py-2 hover:bg-black hover:text-[#ccff00] transition-colors cursor-none interactive-element">
                <GithubIcon className="w-3 h-3 md:w-4 md:h-4" /> Source
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest border-2 border-black bg-black text-[#ccff00] px-3 py-2 hover:bg-transparent hover:text-black transition-colors cursor-none interactive-element">
                <ExternalLink className="w-3 h-3 md:w-4 md:h-4" /> Demo
              </a>
            )}
            {!project.github && !project.live && (
               <span className="text-[10px] font-mono font-bold uppercase text-black/50 border border-black/10 px-3 py-2">
                 Internal / Offline Build
               </span>
            )}
          </div>
        </div>

      </div>
    </FadeReveal>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const cursorRef = useRef(null);
  const requestRef = useRef(null);
  const mousePosition = useRef({ x: -100, y: -100 }); // Target
  const cursorPosition = useRef({ x: -100, y: -100 }); // Current animated
  const [isHovering, setIsHovering] = useState(false);

  // Global mouse tracking optimized with Lerp (Linear Interpolation) for fluid smoothness
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      
      // Update hovering state only for CSS styling changes
      const target = e.target;
      const isInteractive = target.closest('a') || target.closest('button') || target.closest('.interactive-element');
      
      setIsHovering(!!isInteractive);
    };

    const animateCursor = () => {
      // Lerp formula: current = current + (target - current) * friction
      cursorPosition.current.x += (mousePosition.current.x - cursorPosition.current.x) * 0.15;
      cursorPosition.current.y += (mousePosition.current.y - cursorPosition.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPosition.current.x}px, ${cursorPosition.current.y}px)`;
      }

      requestRef.current = requestAnimationFrame(animateCursor);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    requestRef.current = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // COMPILED PROJECTS WITH ACTUAL LINKS AND IMPACT
  const projects = [
    {
      id: "SYS.01", title: "Web-Based Point of Sale (POS) System", type: "Full-Stack Automation",
      specs: [ "React", "Python(Flask)", "PL/SQL"],
      desc: "Developed a full-stack Point of Sale (POS) platform using React, Flask, and SQL to automate sales, billing and inventory management through a centralized web application.",
      impact: "Implemented RESTful APIs, role-based accesscontrol (RBAC), cart management, and automated invoicing, while building a real-time analytics dashboard for inventory tracking and sales monitoring, improving operational efficiency and data accuracy.",
      github: "https://github.com/vinothkumar-coder/WEB-BASED-POS"
    },
    {
      id: "SYS.02", title: "Data Analytics & Visualization Project", type: "Visualization Project",
      specs: ["Python(Pandas)", "MYSQL", "Excel", "Power BI"],
      desc: "Performed end-to-end data analysis using Python, SQL, and Power BI, applying data cleaning, transformation, and exploratory data analysis (EDA) techniques to improve data quality and generate actionable business insights.",
      impact: "Developed interactive dashboards and KPI-driven visualizations to track performance metrics, identifytrends, and support data-driven decision-making through efficient reporting and analytical workflows.",
      github: "https://github.com/vinothkumar-coder/Customer-Behavior-Analysis"
    },
    {
      id: "SYS.03", title: "SMARTSDLCAI |Mini Project", type: "an AI-powered platform",
      specs: ["Generative AI (LLMs)", "Python(gradio , torch , transformers , PyPDF2 , numpy , IPython ,matplotlib )"],
      desc: "Developed SmartSDLC AI, an AI-powered platform that automates key phases of the Software Development LifeCycle (SDLC), including requirement analysis, system design, code generation, testing, and deployment.",
      impact: "Integrated AI-driven workflows and decision-support capabilities to streamline development processes, reduce manual effort, accelerate software delivery, and improve overall project quality and reliability",
      github: "https://github.com/vinothkumar-coder/IBM-project--smartSDLC"
    },
   
  ];

  return (
    <div className="custom-cursor-wrapper min-h-screen bg-[#050505] text-[#f4f4f5] font-sans selection:bg-[#ccff00] selection:text-black overflow-x-hidden">
      
      {/* Magnetic Box Cursor - Now optimized for smooth fluid trailing */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      >
        {/* Inner div manages the stylistic transitions without delaying the position tracking */}
        <div className={`flex items-center justify-center border-2 border-[#ccff00] rounded-none transition-all duration-300 ease-out transform -translate-x-1/2 -translate-y-1/2 ${
            isHovering ? 'w-12 h-12 bg-[#ccff00]/20 backdrop-blur-sm scale-110' : 'w-6 h-6'
        }`}>
          <div className={`bg-[#ccff00] transition-all duration-300 ${isHovering ? 'w-2 h-2 opacity-50' : 'w-1 h-1'}`}></div>
        </div>
      </div>

      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      </div>

      {/* TOP NAV */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-400 mx-auto flex justify-between items-center font-mono text-[10px] md:text-xs uppercase tracking-widest text-zinc-400 p-4 md:px-8">
          <div className="flex items-center gap-3 text-[#ccff00] font-bold">
            <Binary className="w-4 h-4" />
            <span>VINOD</span>
          </div>
          <div className="flex items-center gap-6">
          <a
            href="https://drive.google.com/file/d/1ZuMFRUYL8hmNK-qrcsJ4wwR16FQdP8RT/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 border border-[#ccff00] text-[#ccff00] px-3 py-1 hover:bg-[#ccff00] hover:text-black transition-colors cursor-none interactive-element"
          >
            <FileText className="w-3 h-3" />
            DOWNLOAD RESUME
          </a>
            <span className="text-zinc-600 border border-zinc-800 px-2 py-1 bg-zinc-950">EST. 2026</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-400 mx-auto min-h-screen flex flex-col">
        
        {/* HERO SECTION */}
        <section className="min-h-svh pt-32 pb-16 px-4 md:px-8 flex flex-col justify-center border-b border-zinc-900 relative overflow-hidden">
          
          {/* --- NEW: Leaning Pose Image --- */}
          {/* --- Leaning Pose Image --- */}
<div className="absolute bottom-0 right-0 md:-right-8 lg:-right-48 h-[60%] md:h-[85%] lg:h-[75%] z-0 pointer-events-none flex justify-end">
  <FadeReveal delay={1200} className="h-full w-full">
    <img
      src="/wallpose.png"
      alt="vinod-wallpose"
      className="h-full w-auto object-contain object-bottom-right opacity-50 md:opacity-80 grayscale contrast-125 drop-shadow-[-10px_0_30px_rgba(204,255,0,0.15)] scale-110 lg:scale-125 origin-bottom-right"
    />
  </FadeReveal>
</div>

          <div className="w-full mb-8 z-10 cursor-default relative">
            <h1 className="flex flex-col font-black uppercase tracking-tighter leading-[0.85] text-[clamp(3.5rem,11vw,12rem)] w-full">
              <ScrambleHeading text="Python" delay={100} className="text-white" />
              <ScrambleHeading text="React" delay={600} className="text-transparent [-webkit-text-stroke:1px_#52525b] md:[-webkit-text-stroke:2px_#52525b]" />
              <ScrambleHeading text="SQL" delay={1100} className="text-[#ccff00]" />
            </h1>
          </div>

          <FadeReveal delay={1500} className="w-full flex flex-col lg:flex-row gap-8 lg:gap-16 items-start lg:items-end border-t border-zinc-900 pt-8 mt-auto z-10">
            <div className="w-full lg:w-1/3">
              <div className="font-mono text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-[#ccff00] pl-3">
                Core Identity
              </div>
              <h2 className="text-base md:text-xl font-bold uppercase tracking-tight text-white mb-4">
                Full Stack Developer | Python • React • SQL
              </h2>
              {/* THE HUMAN SIDE - Scannable Summary */}
              <ul className="space-y-2 font-mono text-xs text-zinc-400">
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#ccff00]" /> Chennai, Tamil Nadu</li>
                <li className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-[#ccff00]" /> Msc CS @ UNOM </li>
                <li className="flex items-center gap-2"><BarChart className="w-4 h-4 text-[#ccff00]" /> CGPA: 8.7</li>
              </ul>
            </div>
            
            <div className="w-full lg:w-2/3 relative z-20">
              <p className="text-sm md:text-lg font-medium text-zinc-400 leading-relaxed max-w-4xl mb-8">
                Computer Science graduate with hands-on experience in full-stack development using Python, Flask, React.js, and
SQL. Skilled in building scalable web applications, designing RESTful APIs, and developing data-driven solutions,
with project experience in POS systems and AI-powered platforms. Strong foundation in software engineering,
database management, and problem-solving
              </p>
              
              {/* HARD-HITTING CTAS */}
              <div className="flex flex-wrap gap-4">
                  <a
        href="https://drive.google.com/file/d/1ZuMFRUYL8hmNK-qrcsJ4wwR16FQdP8RT/view?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 font-bold uppercase tracking-widest hover:bg-white transition-colors cursor-none interactive-element"
      >
        <FileText className="w-4 h-4" /> View Resume
      </a>
                <a href="https://github.com/vinothkumar-coder" target="_blank" rel="noreferrer" className="flex items-center gap-2 border border-zinc-700 text-white px-6 py-3 font-bold uppercase tracking-widest hover:border-[#ccff00] hover:text-[#ccff00] transition-colors cursor-none interactive-element bg-[#050505]/50 backdrop-blur-sm">
                  <GithubIcon className="w-4 h-4" /> GitHub Profile
                </a>
              </div>
            </div>
          </FadeReveal>
        </section>

        {/* --- BRUTALIST QUOTE BANNER --- */}
        <section className="py-12 md:py-16 bg-[#ccff00] border-b border-zinc-900 flex items-center justify-center px-4">
           <FadeReveal>
             <h2 className="text-black font-black uppercase tracking-tighter text-xl md:text-3xl lg:text-5xl text-center max-w-5xl leading-tight">
               "A JACK OF ALL TRADES IS A MASTER OF NONE, <br className="hidden md:block"/> BUT OFTENTIMES BETTER THAN A MASTER OF ONE."
             </h2>
           </FadeReveal>
        </section>

        {/* --- SYSTEM ARCHITECTURE MATRIX --- */}
        <section className="py-24 md:py-32 px-4 md:px-8 bg-[#0a0a0c] border-b border-zinc-900">
          <FadeReveal>
            <div className="mb-16">
              <div className="font-mono text-[#ccff00] text-[10px] md:text-xs uppercase tracking-widest mb-4">
                [ Technical Specifications ]
              </div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
                Projects
              </h2>
            </div>
          </FadeReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800">
            {/* project 1 */}
            <FadeReveal delay={0} className="bg-[#050505] p-8 md:p-10 hover:bg-[#0a0a0c] transition-colors group">
              <CircuitBoard className="w-10 h-10 text-zinc-600 group-hover:text-[#ccff00] mb-8 transition-colors" />
              <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-4">Projects
Web-Based Point of Sale (POS) System</h3>
              <p className="text-zinc-500 text-sm mb-8">Developed a full-stack Point of Sale (POS) platform using React, Flask, and SQL to automate sales, billing, and
inventory management through a centralized web application.</p>
              <div className="flex flex-wrap gap-2">
                {["Python(Flask)", "React.JS", "PL/SQL"].map(skill => (
                  <span key={skill} className="px-2 py-1 text-[10px] font-mono border border-zinc-800 text-zinc-400 uppercase bg-zinc-950/50">{skill}</span>
                ))}
              </div>
            </FadeReveal>

            {/* project 2*/}
            <FadeReveal delay={150} className="bg-[#050505] p-8 md:p-10 hover:bg-[#0a0a0c] transition-colors group">
              <Cpu className="w-10 h-10 text-zinc-600 group-hover:text-[#ccff00] mb-8 transition-colors" />
              <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-4">Data Analytics & Visualization Project</h3>
              <p className="text-zinc-500 text-sm mb-8">Performed end-to-end data analysis using Python, SQL, and Power BI, applying data cleaning, transformation,
and exploratory data analysis (EDA) techniques to improve data quality and generate actionable business
insights.</p>
              <div className="flex flex-wrap gap-2">
                {["Python(Pandas)", "MYSQL", "Excel", "Power BI"].map(skill => (
                  <span key={skill} className="px-2 py-1 text-[10px] font-mono border border-zinc-800 text-zinc-400 uppercase bg-zinc-950/50">{skill}</span>
                ))}
              </div>
            </FadeReveal>

            {/* project 3*/}
            <FadeReveal delay={300} className="bg-[#050505] p-8 md:p-10 hover:bg-[#0a0a0c] transition-colors group">
              <Globe className="w-10 h-10 text-zinc-600 group-hover:text-[#ccff00] mb-8 transition-colors" />
              <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-4">SMARTSDLCAI |Mini Project</h3>
              <p className="text-zinc-500 text-sm mb-8">Developed SmartSDLC AI, an AI-powered platform that automates key phases of the Software Development Life
Cycle (SDLC), including requirement analysis, system design, code generation, testing, and deployment.</p>
              <div className="flex flex-wrap gap-2">
                {["Generative AI (LLMs)", "Python(gradio , torch , transformers , PyPDF2 , numpy , IPython ,matplotlib )"].map(skill => (
                  <span key={skill} className="px-2 py-1 text-[10px] font-mono border border-zinc-800 text-zinc-400 uppercase bg-zinc-950/50">{skill}</span>
                ))}
              </div>
            </FadeReveal>
          </div>
        </section>

        {/* --- EXPERIENCE & AWARDS SECTION --- */}
        <section className="py-24 md:py-32 px-4 md:px-8 bg-[#050505] border-b border-zinc-900">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-6xl mx-auto">
            
            {/* Experience & Certs */}
            <div>
              <FadeReveal>
                <h2 className="font-mono text-[#ccff00] text-[10px] md:text-xs uppercase tracking-widest mb-8 border-b border-zinc-800 pb-4">
                  Experience & Certifications
                </h2>
              </FadeReveal>
              
              <div className="space-y-8">
 <FadeReveal delay={100}>
                  <div className="border-l-2 border-zinc-800 pl-6 relative">
                    <div className="absolute w-2 h-2 bg-[#ccff00] rounded-full -left-[5px] top-2"></div>
                    <span className="font-mono text-xs text-zinc-500 uppercase">Jul 2023// WEB Development intern– Team Everest</span>
                    <h3 className="text-xl font-bold uppercase text-white mt-1">Chennai-Chrompet </h3>
                    <p className="text-sm text-zinc-400 mt-2 leading-relaxed">Excited to share my experience as a **Web Development Intern**, where I gained hands-on experience in **HTML, CSS, JavaScript, Python, Flask, and responsive web development**. This experience strengthened my problem-solving and development skills while giving me practical exposure to building and improving web applications.
</p>
                  </div>
                </FadeReveal>
                <FadeReveal delay={100}>
                  <div className="border-l-2 border-zinc-800 pl-6 relative">
                    <div className="absolute w-2 h-2 bg-[#ccff00] rounded-full -left-[5px] top-2"></div>
                    <span className="font-mono text-xs text-zinc-500 uppercase">Jul 2025 // Python Intern – Eagle High Tech Pvt Ltd</span>
                    <h3 className="text-xl font-bold uppercase text-white mt-1">Chennai</h3>
                    <p className="text-sm text-zinc-400 mt-2 leading-relaxed">Worked on real-time Python projects
Assisted in development and testing
Improved debugging skills</p>
                  </div>
                </FadeReveal>
 <FadeReveal delay={100}>
                  <div className="border-l-2 border-zinc-800 pl-6 relative">
                    <div className="absolute w-2 h-2 bg-[#ccff00] rounded-full -left-[5px] top-2"></div>
                    <span className="font-mono text-xs text-zinc-500 uppercase">June 2026 // Product Analyst Intern – Camu Pvt Ltd</span>
                    <h3 className="text-xl font-bold uppercase text-white mt-1">Chennai-Perungudi </h3>
                    <p className="text-sm text-zinc-400 mt-2 leading-relaxed">Excited to share my experience as a **Product Analyst**, where I gained hands-on exposure to **product analytics, data analysis, SQL, Python, Power BI, and Excel**. This experience strengthened my analytical and problem-solving skills while helping me understand how data-driven insights support better product and business decisions.
</p>
                  </div>
                </FadeReveal>

                <FadeReveal delay={200}>
                  <div className="border-l-2 border-zinc-800 pl-6 relative">
                    <div className="absolute w-2 h-2 bg-zinc-600 rounded-full -left-[5px] top-2"></div>
                    <span className="font-mono text-xs text-zinc-500 uppercase">2024 - 2025 // Core Certifications</span>
                    <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                      <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#ccff00] shrink-0" />Python Programming Proficiency Certificate Holder</li>
                      <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#ccff00] shrink-0" /> front-end Development course completion</li>
                      <li className="flex items-start gap-2"><ArrowRight className="w-4 h-4 text-[#ccff00] shrink-0" /> NPTEL: Industry 4.0, IIoT, Python</li>
                    </ul>
                  </div>
                </FadeReveal>
              </div>
            </div>

            {/* Honors & Publications */}
            <div>
              <FadeReveal>
                <h2 className="font-mono text-[#ccff00] text-[10px] md:text-xs uppercase tracking-widest mb-8 border-b border-zinc-800 pb-4">
                  Honors & Publications
                </h2>
              </FadeReveal>
              
              <div className="space-y-6">
                {[
                  { title: "1st Prize - TNC", desc: "Python Programming Certification" },
                  { title: "1st Prize - Front-end-development", desc: "front-end Development course completion" },
                  { title: "1st Prize - mathenatical-ability", desc: "Advanced statistics" },
                  { title: "2nd Prize - Innovation Challenge", desc: "water-waste-management-Tech" },
    
                ].map((honor, idx) => (
                  <FadeReveal delay={idx * 100} key={idx}>
                    <div className="bg-[#0a0a0c] border border-zinc-800 p-4 flex items-center gap-4 hover:border-[#ccff00] transition-colors">
                      <Award className="w-6 h-6 text-[#ccff00] shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold uppercase text-white">{honor.title}</h4>
                        <p className="text-xs text-zinc-500 uppercase font-mono mt-1">{honor.desc}</p>
                      </div>
                    </div>
                  </FadeReveal>
                ))}
              </div>
            </div>

            {/* --- GITHUB ACTIVITY TELEMETRY --- */}
           

          </div>
        </section>

        {/* INTERACTIVE PROJECTS GRID */}
        <section className="py-24 md:py-32 bg-[#050505]">
          <FadeReveal className="px-4 md:px-8">
            <div className="mb-12 md:mb-16 flex flex-col md:flex-row justify-between md:items-end gap-6">
              <div>
                <div className="font-mono text-[#ccff00] text-[10px] md:text-xs uppercase tracking-widest mb-4">
                  [ System Logs & Builds ]
                </div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                  PROJECTS
                </h2>
              </div>
              <a href="https://github.com/vinothkumar-coder" target="_blank" rel="noreferrer" className="flex items-center gap-2 border border-zinc-700 text-white px-5 py-2 text-sm font-bold uppercase tracking-widest hover:border-[#ccff00] hover:text-[#ccff00] transition-colors cursor-none interactive-element w-max">
                <GithubIcon className="w-4 h-4" /> View All on GitHub
              </a>
            </div>
          </FadeReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-zinc-900 border-y border-zinc-900">
            {projects.map((project, index) => (
              <HoverProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </section>

        {/* BRUTALIST FOOTER WITH CTAS */}
        <section id="contact" className="py-24 md:py-32 px-4 md:px-8 bg-[#ccff00] text-black overflow-hidden relative interactive-element">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4 hidden md:block">
            <CircuitBoard className="w-[40rem] h-[40rem]" />
          </div>

          <FadeReveal className="relative z-10 max-w-6xl mx-auto flex flex-col items-start md:items-center md:text-center">
            <div className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest border-2 border-black px-4 py-2 mb-8 md:mb-12">
              [ Open For Opportunities & Custom Builds ]
            </div>
            
            <a href="mailto:yogarathinam26@gmail.com" className="group relative block w-full cursor-none">
              <h2 className="text-[12vw] md:text-[8vw] font-black uppercase tracking-tighter leading-none group-hover:tracking-widest transition-all duration-700 text-left md:text-center">
                GET IN TOUCH
              </h2>
            </a>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full justify-center">
              <a href="https://drive.google.com/file/d/1ZuMFRUYL8hmNK-qrcsJ4wwR16FQdP8RT/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 border-2 border-black bg-black text-[#ccff00] px-8 py-4 text-sm md:text-base font-bold uppercase tracking-widest hover:bg-transparent hover:text-black transition-colors cursor-none interactive-element">                  <FileText className="w-5 h-5" /> Download Resume
               </a>
               <a href="https://linkedin.com/in/vinoth-kumar-coder" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 border-2 border-black text-black px-8 py-4 text-sm md:text-base font-bold uppercase tracking-widest hover:bg-black hover:text-[#ccff00] transition-colors cursor-none interactive-element">
                  <ArrowRight className="w-5 h-5" /> Connect on LinkedIn
               </a>
            </div>
            
            <p className="mt-8 font-bold text-black/70 max-w-md mx-auto text-sm md:text-base text-center">
              Constantly learning, constantly building. Let's coding something real.
            </p>
          </FadeReveal>
        </section>
        
        <footer className="py-8 px-4 md:px-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 font-mono text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-widest bg-[#050505]">
          <div>© {new Date().getFullYear()} VINOTH KUMAR . R <br className="md:hidden" /> // </div>
          <div className="flex flex-wrap gap-4 md:gap-8">
            <a href="https://github.com/vinothkumar-coder" target="_blank" rel="noreferrer" className="hover:text-[#ccff00] transition-colors cursor-none interactive-element">GitHub_Repository</a>
            <a href="https://linkedin.com/in/vinoth-kumar-coder" target="_blank" rel="noreferrer" className="hover:text-[#ccff00] transition-colors cursor-none interactive-element">LinkedIn_Network</a>
            <a href="#" className="hover:text-[#ccff00] transition-colors cursor-none interactive-element">SkillRack_Profile</a>
          </div>
        </footer>

      </main>

      {/* Global CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=JetBrains+Mono:wght@400;700;900&display=swap');

        html { 
          scroll-behavior: smooth; 
          background: #050505;
        }

        body {
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }

        /* GLOBALLY HIDE DEFAULT CURSOR ON DESKTOP */
        @media (min-width: 768px) {
          .custom-cursor-wrapper, 
          .custom-cursor-wrapper * {
            cursor: none !important;
          }
        }

        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }

        /* Modern Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          background: #050505;
          border-left: 1px solid #18181b;
        }
        ::-webkit-scrollbar-thumb {
          background: #27272a;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #ccff00;
        }
      `}} />
    </div>
  );
}