
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Zap, ShieldCheck, Globe, Star, ChevronDown, 
  FileText, ImageIcon, Check, ArrowRight, Sparkles, 
  MousePointer2, Layers, Cpu
} from 'lucide-react';
import { TOOLS, getIcon, DEFAULT_SEO } from '../constants';
import { ToolCategory } from '../types';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');
  const [sliderVal, setSliderVal] = useState(50);

  const categories = ['All', ...Object.values(ToolCategory)];

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    return tool.enabled && matchesSearch && matchesCategory;
  });

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF Master",
    "url": "https://pdfmaster.app",
    "description": DEFAULT_SEO.description,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="pb-20 overflow-x-hidden">
      <SEO schema={homeSchema} />

      {/* Hero Section */}
      <section className="relative bg-white dark:bg-slate-900 pt-20 pb-16 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-red-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            <Sparkles size={14} />
            Trusted by 2M+ Users
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[0.95] animate-in fade-in slide-in-from-top-6 duration-1000">
            The Ultimate <span className="text-red-600 relative inline-block">
              PDF Suite
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                <path d="M0 7C20 1 40 1 100 7" stroke="#EF4444" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span> <br className="hidden md:block"/> Engineered for Privacy
          </h1>
          
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Stop uploading sensitive data to the cloud. Process, merge, and convert PDFs 
            <span className="text-slate-900 dark:text-white font-bold"> 100% locally </span> 
            inside your browser.
          </p>
          
          <div className="max-w-2xl mx-auto relative group mb-16">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-[2rem] blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] p-2 shadow-2xl transition-all">
              <div className="pl-6 text-slate-400">
                <Search size={24} />
              </div>
              <input 
                type="text" 
                placeholder="Search tools: 'merge', 'ocr', 'compress'..."
                className="flex-grow bg-transparent border-none py-4 px-4 focus:outline-none dark:text-white text-lg font-medium placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="hidden sm:block bg-red-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-600/20">
                Quick Find
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
              <ShieldCheck className="text-green-500" size={18} /> No Server Upload
            </div>
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
              <Check className="text-red-600" size={18} /> GDPR Compliant
            </div>
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
              <Zap className="text-yellow-500" size={18} /> Instant Local Speed
            </div>
          </div>
        </div>
      </section>

      {/* Visual Transformation - Before/After Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-block p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl">
                <Cpu size={32} strokeWidth={2.5} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                Experience the <br/> <span className="text-red-600">Transformation</span>
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Our proprietary browser engine cleans, optimizes, and secures your documents with visual precision. Drag the slider to see how we turn scattered data into a clean, searchable, and professional PDF.
              </p>
              
              <ul className="space-y-4">
                {[
                  { icon: <ImageIcon size={20} />, text: "Turn images into optimized PDF structures" },
                  { icon: <Layers size={20} />, text: "Merge messy documents into one sleek file" },
                  { icon: <MousePointer2 size={20} />, text: "Make scanned text fully selectable" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold dark:text-white">
                    <div className="text-red-600">{item.icon}</div>
                    {item.text}
                  </li>
                ))}
              </ul>

              <Link 
                to="/merge-pdf"
                className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                Try the Engine <ArrowRight size={20} />
              </Link>
            </div>

            <div className="lg:w-1/2 w-full">
              <div className="relative group rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-8 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 h-[500px]">
                {/* Before Image (Stylized) */}
                <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 opacity-50 grayscale p-12 w-full h-full">
                     <div className="bg-white dark:bg-slate-700 rounded-lg shadow-sm p-4 rotate-3 transform">
                        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-600 mb-2"></div>
                        <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-600"></div>
                     </div>
                     <div className="bg-white dark:bg-slate-700 rounded-lg shadow-sm p-4 -rotate-6 transform">
                        <div className="h-4 w-full bg-slate-200 dark:bg-slate-600 mb-2"></div>
                        <div className="h-32 w-full bg-slate-100 dark:bg-slate-600 rounded"></div>
                     </div>
                     <div className="bg-white dark:bg-slate-700 rounded-lg shadow-sm p-4 rotate-12 transform mt-8">
                        <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-600 mb-2"></div>
                        <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-600"></div>
                     </div>
                  </div>
                  <div className="absolute top-8 left-8 bg-slate-900/80 text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest z-20">Before</div>
                </div>

                {/* After Image (Stylized) */}
                <div 
                  className="absolute inset-0 bg-white dark:bg-slate-900 border-l-4 border-red-600 transition-all duration-75 overflow-hidden"
                  style={{ clipPath: `inset(0 0 0 ${sliderVal}%)` }}
                >
                  <div className="p-12 h-full flex flex-col justify-center">
                    <div className="max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-100 dark:border-slate-700 mx-auto">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white">
                          <FileText size={24} />
                        </div>
                        <div>
                          <p className="font-black dark:text-white">Master_Report.pdf</p>
                          <p className="text-[10px] text-green-600 font-bold tracking-widest uppercase">Verified & Optimized</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded"></div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded"></div>
                        <div className="h-2 w-3/4 bg-slate-100 dark:bg-slate-700 rounded"></div>
                        <div className="h-20 w-full bg-slate-50 dark:bg-slate-700/50 rounded-xl mt-4 border border-slate-100 dark:border-slate-700"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-8 right-8 bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest z-20">After</div>
                </div>

                {/* Slider Input */}
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sliderVal} 
                  onChange={(e) => setSliderVal(parseInt(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize z-30"
                />
                <div 
                  className="absolute inset-y-0 w-1 bg-red-600 z-20 pointer-events-none"
                  style={{ left: `${sliderVal}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-2xl flex items-center justify-center text-red-600 border-2 border-red-600">
                    <ChevronDown className="rotate-90" size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <div className="container mx-auto px-4 mt-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <h2 className="text-3xl font-black dark:text-white tracking-tight">Explore the Toolbox</h2>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                  ? "bg-red-600 text-white shadow-xl shadow-red-600/20 scale-105" 
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700 hover:border-red-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <Link 
              key={tool.id}
              to={tool.path}
              className="group relative bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-2 transition-all duration-500 flex flex-col items-start overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="text-red-600" size={20} />
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl mb-6 text-slate-400 group-hover:bg-red-600 group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-sm">
                {getIcon(tool.icon, 32)}
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-red-600 transition-colors">{tool.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content: Benefits */}
      <section className="bg-slate-900 py-32 mt-32 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Enterprise Privacy <br/> <span className="text-red-500">For Everyone</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-medium text-lg">We've redesigned document management from the ground up to be safe, fast, and completely anonymous.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { icon: <ShieldCheck size={40} className="text-green-500" />, title: "Zero Data Trails", desc: "No uploads, no servers, no logs. Your files stay in your computer's RAM and disappear instantly after closing the tab." },
              { icon: <Zap size={40} className="text-yellow-500" />, title: "Native Engine", desc: "Built with WebAssembly and local processing threads. Handle 100MB+ files faster than cloud-based tools." },
              { icon: <Globe size={40} className="text-blue-500" />, title: "Universal Access", desc: "No account or login required for basic tasks. 100% free with no annoying watermarks or limits." }
            ].map((benefit, i) => (
              <div key={i} className="text-center group">
                <div className="inline-block p-6 bg-white/5 rounded-[2rem] mb-8 group-hover:bg-red-600/10 group-hover:scale-110 transition-all">{benefit.icon}</div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">{benefit.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Got Questions?</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Everything you need to know about the most secure PDF suite.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: "How is this different from iLovePDF?", a: "iLovePDF uploads your files to their servers. We process everything locally in your browser. Your private data never touches our infrastructure." },
              { q: "Is there a catch for it being free?", a: "No catch. We use standard AdSense placements to keep the lights on without charging users or selling data." },
              { q: "Does it work on smartphones?", a: "Yes! PDF Master is fully responsive and uses optimized mobile browsers to handle PDF tasks on the go." },
              { q: "What about heavy files?", a: "Our local engine is highly optimized. As long as your device has enough RAM, it can process even huge architectural blueprints." }
            ].map((faq, i) => (
              <div key={i} className="p-8 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all">
                <h3 className="font-black text-lg mb-4 dark:text-white tracking-tight leading-tight">{faq.q}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
