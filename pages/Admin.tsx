
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Settings as SettingsIcon, Package, ToggleLeft, 
  ToggleRight, Eye, ShieldCheck, Globe, Save, Lock, User as UserIcon,
  AlertCircle, ChevronRight, LogOut
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TOOLS, getIcon } from '../constants';

const mockData = [
  { name: 'Mon', uploads: 400, downloads: 320 },
  { name: 'Tue', uploads: 300, downloads: 280 },
  { name: 'Wed', uploads: 600, downloads: 550 },
  { name: 'Thu', uploads: 800, downloads: 750 },
  { name: 'Fri', uploads: 700, downloads: 680 },
  { name: 'Sat', uploads: 500, downloads: 450 },
  { name: 'Sun', uploads: 450, downloads: 400 },
];

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'tools' | 'settings'>('stats');
  const [toolStates, setToolStates] = useState(
    TOOLS.reduce((acc, tool) => ({ ...acc, [tool.id]: true }), {} as Record<string, boolean>)
  );

  // Check session on mount
  useEffect(() => {
    const session = sessionStorage.getItem('admin_auth');
    if (session === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Requested Credentials
    if (loginUser === "pdfmaster" && loginPass === "*ANWaar3169501#") {
      setIsAuthenticated(true);
      setLoginError(false);
      sessionStorage.setItem('admin_auth', 'true');
    } else {
      setLoginError(true);
      setLoginPass(""); // Clear password on failure
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  const toggleTool = (id: string) => {
    setToolStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center bg-red-600 text-white w-16 h-16 rounded-2xl shadow-xl mb-6">
                <Lock size={32} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Admin Portal</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Please sign in to access management tools</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-red-600 transition-colors">
                    <UserIcon size={18} />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-red-600/10 focus:border-red-600 transition-all dark:text-white font-medium"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-red-600 transition-colors">
                    <ShieldCheck size={18} />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-red-600/10 focus:border-red-600 transition-all dark:text-white font-medium"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              {loginError && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl border border-red-100 dark:border-red-800 animate-in shake duration-500">
                  <AlertCircle size={18} />
                  <p className="text-sm font-bold">Invalid credentials. Access denied.</p>
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl mt-6 active:scale-95"
              >
                Sign In
                <ChevronRight size={20} />
              </button>
            </form>
          </div>
          <p className="text-center mt-8 text-slate-400 text-sm">
            Protected by PDF Master Security Protocol v2.0
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8 animate-in fade-in duration-700">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 flex flex-col gap-2">
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-3 p-4 rounded-xl font-semibold transition-all ${activeTab === 'stats' ? "bg-red-600 text-white shadow-lg" : "hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300"}`}
        >
          <BarChart3 size={20} />
          Analytics
        </button>
        <button 
          onClick={() => setActiveTab('tools')}
          className={`flex items-center gap-3 p-4 rounded-xl font-semibold transition-all ${activeTab === 'tools' ? "bg-red-600 text-white shadow-lg" : "hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300"}`}
        >
          <Package size={20} />
          Tools Management
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-3 p-4 rounded-xl font-semibold transition-all ${activeTab === 'settings' ? "bg-red-600 text-white shadow-lg" : "hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300"}`}
        >
          <SettingsIcon size={20} />
          SEO & Ads
        </button>
        <div className="mt-12 p-6 bg-slate-900 text-white rounded-[2rem] shadow-xl">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-2 font-black">Admin Role</p>
          <p className="font-bold text-lg mb-4">Master Admin</p>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl w-full transition-colors font-bold"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm min-h-[600px]">
        {activeTab === 'stats' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-black mb-8 dark:text-white tracking-tight">Platform Overview</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Uploads', value: '142,402', change: '+12.5%', icon: <Package className="text-blue-500" /> },
                { label: 'Total Users', value: '18,203', change: '+5.2%', icon: <Users className="text-purple-500" /> },
                { label: 'Page Views', value: '892,104', change: '+24.1%', icon: <Eye className="text-green-500" /> },
                { label: 'Tool Success', value: '99.8%', change: 'Stable', icon: <ShieldCheck className="text-orange-500" /> },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">{stat.icon}</div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-1 font-medium">{stat.label}</p>
                  <p className="text-2xl font-black dark:text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="h-[400px] w-full mt-12 bg-slate-50/50 dark:bg-slate-900/30 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold mb-6 dark:text-white">Usage Traffic (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Bar dataKey="uploads" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="downloads" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-black mb-8 dark:text-white tracking-tight">Tools Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TOOLS.map((tool) => (
                <div key={tool.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                      {getIcon(tool.icon, 24, "text-red-600")}
                    </div>
                    <div>
                      <p className="font-bold dark:text-white">{tool.name}</p>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{tool.category}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleTool(tool.id)}
                    className="text-slate-400 hover:text-red-600 transition-colors"
                  >
                    {toolStates[tool.id] ? <ToggleRight size={40} className="text-red-600" /> : <ToggleLeft size={40} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-10">
            <section>
              <h2 className="text-2xl font-black mb-6 dark:text-white flex items-center gap-3 tracking-tight">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Globe size={20} className="text-blue-600" />
                </div>
                SEO Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Meta Title Template</label>
                  <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all dark:text-white" defaultValue="PDF Master - %tool% Online" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Sitemap Generation</label>
                  <select className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all dark:text-white">
                    <option>Daily (Automated)</option>
                    <option>Weekly</option>
                    <option>Manual</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Default Meta Description</label>
                  <textarea rows={3} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all dark:text-white" defaultValue="Easily merge, split, compress, convert and protect your PDF files with PDF Master. The ultimate online tool for document management." />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-6 dark:text-white flex items-center gap-3 tracking-tight">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Package size={20} className="text-red-600" />
                </div>
                AdSense Configuration
              </h2>
              <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold dark:text-white text-lg">Enable Google AdSense</p>
                    <p className="text-sm text-slate-500">Turn advertisements on/off platform-wide.</p>
                  </div>
                  <ToggleRight size={44} className="text-green-500 cursor-pointer" />
                </div>
                <hr className="border-slate-200 dark:border-slate-800" />
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Publisher ID (ca-pub-XXXXXXXXXX)</label>
                  <input type="text" className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:border-red-600 outline-none transition-all dark:text-white" placeholder="ca-pub-0000000000000000" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button className="p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-all font-bold dark:text-white shadow-sm">Top Banner Placement</button>
                  <button className="p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-all font-bold dark:text-white shadow-sm">Sidebar (Desktop only)</button>
                </div>
              </div>
            </section>

            <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-[1.5rem] font-black text-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-3 shadow-2xl active:scale-95">
              <Save size={24} />
              Save All Changes
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
