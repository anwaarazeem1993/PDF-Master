
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, Settings, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from './AuthContext';
import { TOOLS, getIcon } from '../constants';
import { ToolCategory } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setToolsMenuOpen(false);
  }, [location]);

  // Group tools by category
  const categories = Object.values(ToolCategory);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <span className="font-black text-xl italic">PM</span>
            </div>
            <span className="text-xl font-black tracking-tight dark:text-white hidden sm:block">PDF Master</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <div 
              className="relative"
              onMouseEnter={() => setToolsMenuOpen(true)}
              onMouseLeave={() => setToolsMenuOpen(false)}
            >
              <button 
                className={`flex items-center gap-1.5 font-bold transition-colors py-5 ${toolsMenuOpen ? 'text-red-600' : 'text-slate-600 dark:text-slate-300 hover:text-red-600'}`}
              >
                PDF Tools
                <ChevronDown size={16} className={`transition-transform duration-300 ${toolsMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Menu */}
              {toolsMenuOpen && (
                <div className="absolute top-full -left-48 w-[800px] animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 p-8 mt-2 grid grid-cols-3 gap-8 overflow-hidden">
                    {categories.map((category) => (
                      <div key={category} className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700 pb-2">
                          {category}
                        </h4>
                        <div className="space-y-1">
                          {TOOLS.filter(t => t.category === category && t.enabled).map((tool) => (
                            <Link 
                              key={tool.id}
                              to={tool.path}
                              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group"
                            >
                              <div className="text-red-600 group-hover:scale-110 transition-transform">
                                {getIcon(tool.icon, 18)}
                              </div>
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{tool.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/merge-pdf" className="text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 font-bold transition-colors">Merge</Link>
            <Link to="/compress-pdf" className="text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 font-bold transition-colors">Compress</Link>
            <Link to="/pdf-to-word" className="text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 font-bold transition-colors">Convert</Link>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <Link to="/admin" className="hidden sm:flex p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
              <Settings size={20} />
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-full font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-600">
                  <LayoutDashboard size={18} className="text-red-600" />
                  Dashboard
                </Link>
                <div 
                  className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-black cursor-pointer shadow-lg hover:scale-105 transition-transform" 
                  title={user.name}
                  onClick={() => navigate('/dashboard')}
                >
                  {user.name[0].toUpperCase()}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hidden sm:block text-slate-600 dark:text-slate-300 font-bold hover:text-red-600 px-4">Login</Link>
                <Link to="/signup" className="hidden sm:flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-full font-black shadow-lg hover:opacity-90 transition-all active:scale-95">
                  Sign Up
                </Link>
              </div>
            )}
            
            <button 
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* AdSense Top Placeholder */}
      <div className="w-full py-4 bg-slate-100 dark:bg-slate-800/50 flex justify-center border-b border-slate-200 dark:border-slate-800">
        <div className="w-full max-w-4xl h-24 bg-slate-200 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
          AdSpace - Leaderboard
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* AdSense Bottom Placeholder */}
      <div className="w-full py-4 bg-slate-100 dark:bg-slate-800/50 flex justify-center border-t border-slate-200 dark:border-slate-800">
        <div className="w-full max-w-4xl h-32 bg-slate-200 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
          AdSpace - Footer Banner
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white">
                  <span className="font-black text-lg italic">P</span>
                </div>
                <span className="text-xl font-black dark:text-white">PDF Master</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                The most advanced client-side PDF suite. Process documents privately and securely directly in your browser.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
              </div>
            </div>
            
            {/* Quick Links Column - Dynamically generated from categories */}
            {categories.slice(0, 3).map((category) => (
              <div key={category}>
                <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-[10px]">
                  {category}
                </h4>
                <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                  {TOOLS.filter(t => t.category === category).slice(0, 4).map(tool => (
                    <li key={tool.id}>
                      <Link to={tool.path} className="hover:text-red-600 transition-colors font-bold">{tool.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-slate-500 font-bold uppercase tracking-widest">
            <p>© 2024 PDF Master. Engineered for Privacy.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-red-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-red-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-red-600 transition-colors">API</a>
              <a href="#" className="hover:text-red-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-white dark:bg-slate-950 animate-in fade-in slide-in-from-right duration-300">
          <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 mb-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white">
                <span className="font-black italic">PM</span>
              </div>
              <span className="font-black dark:text-white">PDF Master</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500">
              <X size={28} />
            </button>
          </div>
          
          <nav className="px-6 h-[calc(100vh-100px)] overflow-y-auto pb-20 space-y-8">
            {categories.map((category) => (
              <div key={category} className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                  {category}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {TOOLS.filter(t => t.category === category && t.enabled).map((tool) => (
                    <Link 
                      key={tool.id}
                      to={tool.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl"
                    >
                      <div className="text-red-600">
                        {getIcon(tool.icon, 16)}
                      </div>
                      <span className="text-xs font-bold dark:text-white">{tool.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
              {user ? (
                 <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-red-600 text-white py-4 rounded-2xl font-black">
                   <LayoutDashboard size={20} />
                   Dashboard
                 </Link>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center py-4 bg-slate-100 dark:bg-slate-900 rounded-2xl font-black text-slate-900 dark:text-white">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center py-4 bg-red-600 rounded-2xl font-black text-white">
                    Sign Up Free
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Layout;
