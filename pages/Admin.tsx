
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Settings as SettingsIcon, Package, ToggleLeft, 
  ToggleRight, Eye, ShieldCheck, Globe, Save, Lock, User as UserIcon,
  AlertCircle, ChevronRight, LogOut, Code, Layout as LayoutIcon, TrendingUp,
  Database, Activity, CheckCircle, Zap
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { TOOLS, getIcon } from '../constants';

const mockData = [
  { name: '01 May', uploads: 400, downloads: 320, dataSize: 120 },
  { name: '02 May', uploads: 300, downloads: 280, dataSize: 98 },
  { name: '03 May', uploads: 600, downloads: 550, dataSize: 210 },
  { name: '04 May', uploads: 800, downloads: 750, dataSize: 450 },
  { name: '05 May', uploads: 700, downloads: 680, dataSize: 320 },
  { name: '06 May', uploads: 500, downloads: 450, dataSize: 280 },
  { name: '07 May', uploads: 950, downloads: 890, dataSize: 512 },
];

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'tools' | 'settings' | 'ads'>('stats');
  
  // Local state for forms
  const [toolStates, setToolStates] = useState(
    TOOLS.reduce((acc, tool) => ({ ...acc, [tool.id]: true }), {} as Record<string, boolean>)
  );

  const [settings, setSettings] = useState({
    siteName: "PDF Master",
    metaDescription: "Professional PDF tools for everyone. 100% free and easy to use.",
    analyticsId: "UA-12345678-1",
    adsEnabled: true,
    topAdHtml: "<!-- Top Banner Ad Placeholder -->\n<div style='width:100%; height:90px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; border:1px dashed #cbd5e1; border-radius:8px; color:#64748b; font-size:12px;'>ADSENSE TOP BANNER (728x90)</div>",
    bottomAdHtml: "<!-- Bottom Footer Ad Placeholder -->\n<div style='width:100%; height:90px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; border:1px dashed #cbd5e1; border-radius:8px; color:#64748b; font-size:12px;'>ADSENSE BOTTOM BANNER (728x90)</div>"
  });

  useEffect(() => {
    const session = sessionStorage.getItem('admin_auth');
    if (session === 'true') setIsAuthenticated(true);
    
    // Load existing settings if any
    const saved = localStorage.getItem('admin_settings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUser === "pdfmaster" && loginPass === "*ANWaar3169501#") {
      setIsAuthenticated(true);
      setLoginError(false);
      sessionStorage.setItem('admin_auth', 'true');
    } else {
      setLoginError(true);
      setLoginPass("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  const saveSettings = () => {
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    alert("Settings updated successfully!");
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
              <p className="text-slate-500 dark:text-slate-400 font-medium">Authentication required</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Username</label>
                <input 
                  type="text" required value={loginUser} onChange={(e) => setLoginUser(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-6 focus:outline-none focus:border-red-600 transition-all dark:text-white font-medium"
                  placeholder="Username"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                <input 
                  type="password" required value={loginPass} onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-6 focus:outline-none focus:border-red-600 transition-all dark:text-white font-medium"
                  placeholder="••••••••"
                />
              </div>

              {loginError && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl border border-red-100 dark:border-red-800">
                  <AlertCircle size={18} />
                  <p className="text-sm font-bold">Invalid credentials.</p>
                </div>
              )}

              <button type="submit" className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl mt-6">
                Sign In <ChevronRight size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 flex flex-col gap-2">
        <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white mb-4 shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/20 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <p className="font-bold text-sm">System Online</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 py-2.5 px-4 rounded-xl transition-all w-full justify-center">
            <LogOut size={14} /> Log Out
          </button>
        </div>

        {[
          { id: 'stats', label: 'Analytics', icon: BarChart3 },
          { id: 'tools', label: 'Tools', icon: Package },
          { id: 'settings', label: 'Site Config', icon: SettingsIcon },
          { id: 'ads', label: 'Ad Placements', icon: Code },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex items-center justify-between p-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${activeTab === item.id ? "bg-red-600 text-white shadow-xl translate-x-2" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              {item.label}
            </div>
            <ChevronRight size={14} className={activeTab === item.id ? "opacity-100" : "opacity-0"} />
          </button>
        ))}
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow bg-white dark:bg-slate-800 rounded-[3rem] p-8 md:p-12 border border-slate-100 dark:border-slate-700 shadow-sm min-h-[700px]">
        
        {activeTab === 'stats' && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Data Raised</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Real-time platform growth metrics</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-red-600">Last 7 Days</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-700">
                <TrendingUp className="text-red-600 mb-4" size={32} />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Total Files Processed</p>
                <p className="text-3xl font-black dark:text-white">1,402,892</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-700">
                <Database className="text-blue-600 mb-4" size={32} />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Bandwidth Saved</p>
                <p className="text-3xl font-black dark:text-white">4.2 TB</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-700">
                <Activity className="text-green-600 mb-4" size={32} />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Avg. Processing Time</p>
                <p className="text-3xl font-black dark:text-white">0.42s</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/30 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 mb-12">
              <h3 className="text-xl font-black dark:text-white mb-8 flex items-center gap-2">
                <TrendingUp size={24} className="text-red-600" />
                Growth over time
              </h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockData}>
                    <defs>
                      <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                    <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey="uploads" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorUploads)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-700">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-10">Site Configuration</h2>
            
            <div className="space-y-8 max-w-2xl">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Site Global Name</label>
                <input 
                  type="text" 
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-6 focus:outline-none focus:border-red-600 transition-all dark:text-white font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Meta Description (SEO)</label>
                <textarea 
                  rows={4}
                  value={settings.metaDescription}
                  onChange={(e) => setSettings({...settings, metaDescription: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-6 focus:outline-none focus:border-red-600 transition-all dark:text-white font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Google Analytics Tracking ID</label>
                <input 
                  type="text" 
                  value={settings.analyticsId}
                  onChange={(e) => setSettings({...settings, analyticsId: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-6 focus:outline-none focus:border-red-600 transition-all dark:text-white font-bold"
                  placeholder="UA-XXXXXXXX-X"
                />
              </div>

              <div className="pt-6">
                <button 
                  onClick={saveSettings}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 px-12 rounded-[1.5rem] font-black text-xl hover:opacity-90 transition-all shadow-2xl flex items-center gap-3 active:scale-95"
                >
                  <Save size={24} /> Save Configuration
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ads' && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Ad Placements</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Inject custom HTML or script tags globally</p>
              </div>
              <button 
                onClick={() => setSettings({...settings, adsEnabled: !settings.adsEnabled})}
                className="flex items-center gap-3"
              >
                {settings.adsEnabled ? <ToggleRight size={48} className="text-green-500" /> : <ToggleLeft size={48} className="text-slate-300" />}
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Master Switch</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <LayoutIcon size={20} className="text-red-600" />
                  <h3 className="font-black text-lg dark:text-white">Top Ad Unit</h3>
                </div>
                <div className="relative group">
                  <div className="absolute top-4 right-4 text-slate-300">
                    <Code size={20} />
                  </div>
                  <textarea 
                    rows={8}
                    value={settings.topAdHtml}
                    onChange={(e) => setSettings({...settings, topAdHtml: e.target.value})}
                    placeholder="<script>...</script>"
                    className="w-full bg-slate-900 text-green-400 font-mono text-xs p-6 rounded-[2rem] border-2 border-slate-800 focus:border-red-600 transition-all outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest ml-2">Appears below navigation on all pages</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <LayoutIcon size={20} className="text-red-600" />
                  <h3 className="font-black text-lg dark:text-white">Bottom Ad Unit</h3>
                </div>
                <div className="relative group">
                  <div className="absolute top-4 right-4 text-slate-300">
                    <Code size={20} />
                  </div>
                  <textarea 
                    rows={8}
                    value={settings.bottomAdHtml}
                    onChange={(e) => setSettings({...settings, bottomAdHtml: e.target.value})}
                    placeholder="<script>...</script>"
                    className="w-full bg-slate-900 text-green-400 font-mono text-xs p-6 rounded-[2rem] border-2 border-slate-800 focus:border-red-600 transition-all outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest ml-2">Appears above footer on all pages</p>
              </div>
            </div>

            <div className="mt-12 p-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-3xl flex items-start gap-4">
              <Zap className="text-blue-600 shrink-0 mt-1" size={20} />
              <div>
                <p className="font-bold text-blue-900 dark:text-blue-200">Pro Tip: Ad Policy</p>
                <p className="text-sm text-blue-700 dark:text-blue-300/80 leading-relaxed">Ensure your custom HTML follows Google AdSense policy. Asynchronous scripts are recommended for optimal PageSpeed scores.</p>
              </div>
            </div>

            <div className="mt-10">
              <button 
                onClick={saveSettings}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 px-12 rounded-[1.5rem] font-black text-xl hover:opacity-90 transition-all shadow-2xl flex items-center gap-3 active:scale-95"
              >
                <Save size={24} /> Deploy Ad Units
              </button>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-700">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-10">Available Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TOOLS.map((tool) => (
                <div key={tool.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-900/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm group-hover:rotate-6 transition-transform">
                      {getIcon(tool.icon, 24, "text-red-600")}
                    </div>
                    <div>
                      <p className="font-black dark:text-white">{tool.name}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{tool.category}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setToolStates(prev => ({ ...prev, [tool.id]: !prev[tool.id] }))}
                    className="text-slate-400 hover:text-red-600 transition-colors"
                  >
                    {toolStates[tool.id] ? <ToggleRight size={44} className="text-red-600" /> : <ToggleLeft size={44} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
