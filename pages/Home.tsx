
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Zap, ShieldCheck, Globe, ChevronDown, 
  FileText, ImageIcon, Check, ArrowRight, Sparkles, 
  MousePointer2, Layers, Cpu, Server, Lock, HardDrive, 
  Download, Clock, Heart, Star, Plus, Minus
} from 'lucide-react';
import { TOOLS, getIcon, DEFAULT_SEO } from '../constants.tsx';
import { ToolCategory } from '../types.ts';
import SEO from '../components/SEO.tsx';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const categories = ['All', ...Object.values(ToolCategory)];

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    return tool.enabled && matchesSearch && matchesCategory;
  });

  const features = [
    {
      title: "100% Privacy",
      description: "Files never leave your browser. We process everything locally using WebAssembly.",
      icon: <ShieldCheck className="text-green-500" size={32} />
    },
    {
      title: "Blazing Speed",
      description: "No upload or download wait times. Instant processing directly on your hardware.",
      icon: <Zap className="text-yellow-500" size={32} />
    },
    {
      title: "No Limits",
      description: "No daily task limits. Use our tools as much as you need, whenever you want.",
      icon: <Layers className="text-red-500" size={32} />
    }
  ];

  const faqs = [
    { q: "Is PDF Master really free?", a: "Yes! All our tools are free to use. We maintain the site through unobtrusive ads and optional premium accounts for high-volume business users." },
    { q: "How do you protect my privacy?", a: "Unlike other PDF tools, we don't upload your files to a server. All processing happens in your browser's memory and is cleared as soon as you close the tab." },
    { q: "Can I use PDF Master on mobile?", a: "Absolutely. Our suite is fully responsive and works on any modern browser on iOS, Android, and Desktop." },
    { q: "What happens if my file is very large?", a: "Since we use your device's power, performance depends on your RAM. Most modern devices handle PDFs up to 500MB with ease." }
  ];

  return (
    <div className="pb-20 overflow-x-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
      <SEO />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20 dark:opacity-10 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles size={14} />
            The Next Generation of PDF Tools
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Smart PDF Tools <br />
            <span className="text-red-600 relative">
                Without the Wait
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 338 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 10.5C65.5 3 131 1 337 4.5" stroke="#DC2626" strokeWidth="3" strokeLinecap="round"/>
                </svg>
            </span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto mb-12 animate-in fade-in duration-1000 delay-300">
            Privacy-first PDF management. No cloud uploads. No privacy leaks. 
            Just professional tools running directly in your browser.
          </p>

          <div className="max-w-2xl mx-auto relative group mb-16 animate-in fade-in zoom-in duration-700 delay-500">
            <div className="relative flex items-center bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[2.5rem] p-2 shadow-2xl focus-within:border-red-600 transition-all">
              <div className="pl-6 text-slate-400"><Search size={28} /></div>
              <input 
                type="text" placeholder="Search for a tool (e.g., 'merge', 'ocr', 'split')..."
                className="flex-grow bg-transparent border-none py-5 px-4 focus:outline-none dark:text-white text-xl font-medium placeholder:text-slate-300"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tool Categories & Grid */}
      <section className="container mx-auto px-4 mb-32">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setActiveCategory(cat as any)}
                    className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                        activeCategory === cat 
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div 
                key={index}
                className="tool-card group relative bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-start animate-pulse"
              >
                <div className="bg-slate-200 dark:bg-slate-700 w-16 h-16 rounded-2xl mb-8"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-full mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-5/6 mb-6"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-1/3 mt-auto"></div>
              </div>
            ))
          ) : filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
              <Link 
                key={tool.id} to={tool.path}
                className="tool-card group relative bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col items-start"
              >
                <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl mb-8 text-slate-400 group-hover:bg-red-600 group-hover:text-white group-hover:rotate-6 transition-all duration-300">
                  {getIcon(tool.icon, 32)}
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-red-600 transition-colors">{tool.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium mb-6 flex-grow">{tool.description}</p>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-600 group-hover:gap-4 transition-all">
                    Start Tool <ArrowRight size={16} />
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
                <p className="text-slate-400 font-bold text-xl uppercase tracking-widest">No tools matching "{searchQuery}"</p>
                <button onClick={() => setSearchQuery("")} className="mt-4 text-red-600 font-black underline">Clear Search</button>
            </div>
          )}
        </div>
      </section>

      {/* USP Section */}
      <section className="bg-slate-50 dark:bg-slate-800/50 py-24 mb-32 border-y border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">The PDF Master Edge</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">We reimagined how PDF processing should work for the modern, security-conscious user.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {features.map((f, i) => (
                    <div key={i} className="text-center group">
                        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                            {f.icon}
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{f.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{f.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="container mx-auto px-4 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    Why Local Processing <br />is the Future
                </h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Most PDF tools upload your sensitive documents to a remote server. 
                    This creates security vulnerabilities and slows down your workflow with 
                    unnecessary upload times. PDF Master uses **WebAssembly** to run 
                    high-performance logic right on your machine.
                </p>
                <ul className="space-y-4">
                    {[
                        "Zero data breaches - your data never leaves your device.",
                        "No internet? No problem. Once loaded, tools work offline.",
                        "Unlimited file sizes handled by your local RAM.",
                        "Instant processing - no server queues or waiting."
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <div className="mt-1 bg-green-500/10 text-green-600 p-1 rounded-full">
                                <Check size={14} strokeWidth={4} />
                            </div>
                            <span className="text-slate-700 dark:text-slate-300 font-bold">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="grid grid-cols-2 gap-6 relative">
                <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl space-y-6">
                    <Server className="text-red-500" size={32} />
                    <h4 className="font-black text-xl">Cloud Tools</h4>
                    <div className="space-y-3 opacity-50 text-sm font-medium">
                        <p className="flex gap-2"><Minus size={16}/> Slow Uploads</p>
                        <p className="flex gap-2"><Minus size={16}/> Privacy Risk</p>
                        <p className="flex gap-2"><Minus size={16}/> Server Queues</p>
                        <p className="flex gap-2"><Minus size={16}/> Subscription Required</p>
                    </div>
                </div>
                <div className="bg-red-600 p-8 rounded-[3rem] text-white shadow-2xl space-y-6 lg:mt-12 translate-y-4">
                    <Cpu className="text-white" size={32} />
                    <h4 className="font-black text-xl">PDF Master</h4>
                    <div className="space-y-3 text-sm font-black">
                        <p className="flex gap-2"><Check size={16}/> Local Speed</p>
                        <p className="flex gap-2"><Check size={16}/> Military Privacy</p>
                        <p className="flex gap-2"><Check size={16}/> No Wait Times</p>
                        <p className="flex gap-2"><Check size={16}/> 100% Free</p>
                    </div>
                </div>
                {/* Visual Connector */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 font-black shadow-lg">VS</div>
            </div>
        </div>
      </section>

      {/* How it Works Guide */}
      <section className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-24 mb-32 rounded-[4rem] mx-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Three Simple Steps</h2>
                <p className="text-slate-400 dark:text-slate-500 font-medium">Getting your documents ready has never been this easy.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                {/* Line connector for desktop */}
                <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-red-600/0 via-red-600/50 to-red-600/0"></div>
                
                {[
                    { title: "Select Tool", desc: "Choose from our 20+ professional tools for any task.", icon: <MousePointer2 size={32}/> },
                    { title: "Drop Files", desc: "Drag and drop your PDFs. They process instantly.", icon: <HardDrive size={32}/> },
                    { title: "Download", desc: "Get your optimized results immediately.", icon: <Download size={32}/> }
                ].map((step, i) => (
                    <div key={i} className="text-center relative">
                        <div className="w-20 h-20 bg-red-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl relative z-10">
                            {step.icon}
                            <div className="absolute -top-3 -right-3 w-8 h-8 bg-white text-slate-900 dark:bg-slate-900 dark:text-white rounded-full flex items-center justify-center font-black text-sm border-4 border-red-600 shadow-lg">
                                {i+1}
                            </div>
                        </div>
                        <h3 className="text-2xl font-black mb-3">{step.title}</h3>
                        <p className="text-slate-400 dark:text-slate-500 font-medium leading-relaxed px-4">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 mb-32">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Loved by Pros</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">See why thousands of document professionals trust PDF Master daily.</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-6 py-3 rounded-2xl">
                <div className="flex text-yellow-500">
                    {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <span className="font-black text-slate-900 dark:text-white text-sm">4.9/5 Rating</span>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
                { name: "Sarah Jenkins", role: "Legal Assistant", text: "The speed is incredible. I merge dozens of case files daily and not having to wait for uploads has saved me hours.", avatar: "SJ" },
                { name: "Marcus Thorne", role: "Architect", text: "Finally a tool that doesn't mess up the scale of my blueprints during compression. Truly high-quality output.", avatar: "MT" },
                { name: "David Chen", role: "Product Manager", text: "Privacy is my #1 concern. Knowing my files stay in my browser is the reason I made the switch to PDF Master.", avatar: "DC" }
            ].map((t, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-slate-900 dark:bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-lg">
                            {t.avatar}
                        </div>
                        <div>
                            <p className="font-black text-slate-900 dark:text-white leading-none">{t.name}</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{t.role}</p>
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">"{t.text}"</p>
                </div>
            ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 mb-32 max-w-4xl">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Common Questions</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Everything you need to know about our platform.</p>
        </div>
        <div className="space-y-4">
            {faqs.map((faq, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 overflow-hidden transition-all">
                    <button 
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full p-8 flex items-center justify-between text-left group"
                    >
                        <span className="text-lg font-black text-slate-900 dark:text-white group-hover:text-red-600 transition-colors">{faq.q}</span>
                        <div className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}>
                            <ChevronDown size={24} className="text-slate-400" />
                        </div>
                    </button>
                    <div className={`px-8 transition-all duration-300 ease-in-out ${openFaq === i ? 'pb-8 opacity-100 max-h-40' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-50 dark:border-slate-700 pt-6">
                            {faq.a}
                        </p>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container mx-auto px-4">
          <div className="bg-red-600 rounded-[4rem] p-12 md:p-24 text-center text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -mr-64 -mt-64 group-hover:scale-125 transition-transform duration-1000"></div>
              <div className="relative z-10">
                <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">Ready to Master <br />Your PDFs?</h2>
                <p className="text-xl text-red-100 mb-12 max-w-xl mx-auto font-medium">Join 2 million users and experience the fastest, most secure PDF toolset on the web.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link 
                        to="/signup" 
                        className="bg-white text-red-600 px-10 py-5 rounded-[2rem] font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3"
                    >
                        Create Free Account
                        <ArrowRight size={24} />
                    </Link>
                    <Link 
                        to="/dashboard" 
                        className="bg-slate-900/20 text-white border-2 border-white/20 px-10 py-5 rounded-[2rem] font-black text-xl hover:bg-slate-900/40 transition-all flex items-center gap-3 backdrop-blur-sm"
                    >
                        Go to Dashboard
                    </Link>
                </div>
                <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-60">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest"><ShieldCheck size={16}/> Secure SSL</div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest"><Lock size={16}/> Local Encryption</div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest"><Clock size={16}/> Fast Core Vitals</div>
                </div>
              </div>
          </div>
      </section>
    </div>
  );
};

export default Home;
