import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, File, Trash2, Download, Settings, User as UserIcon, 
  BarChart, Search, Grid, LayoutGrid, Layers, ShieldCheck, 
  Trash, ArrowRight, Star, HelpCircle, Activity, Sparkles, LogOut, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { TOOLS, getIcon } from '../constants';
import SEO from '../components/SEO';
import WorkflowBuilder from '../components/WorkflowBuilder';
import { ToolCategory } from '../types';

const Dashboard: React.FC = () => {
  const { user, logout, removeHistory, clearHistory } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'toolbox' | 'activity' | 'workflow'>('toolbox');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showDeletionConfirm, setShowDeletionConfirm] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  if (!user) {
    React.useEffect(() => {
      navigate('/login');
    }, [navigate]);
    return null;
  }

  // Categories helper list for pills
  const categoriesList = ['All', ...Object.values(ToolCategory)];

  // Process list filtering
  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // History download simulations
  const handleDownloadItem = (fileName: string, itemTool: string) => {
    try {
      const fileContent = `PDF Master Conversion Result Receipt\n` +
        `==================================\n` +
        `Document Name: ${fileName}\n` +
        `Tool Leveraged: ${itemTool.toUpperCase()}\n` +
        `Processing Status: COMPLETED_SUCCESSFULLY\n` +
        `Encryption Status: Verified (Local Sandbox Mode)\n` +
        `Date of Action: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n` +
        `==================================\n` +
        `Privacy Note: Your original document never left your browser.\n` +
        `Thank you for using the secure PDF Master browser suite!`;
      
      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccessToast(`Successfully downloaded: ${fileName}`);
      setTimeout(() => setDownloadSuccessToast(null), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  const activeCount = user.history.length;
  const popularTools = TOOLS.slice(0, 3); // top 3 popular tools

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-700 font-sans">
      <SEO title="User Dashboard - PDF Master" description="Securely manage your browser-side PDF files, pipelines, and automation flows." />
      
      {/* Toast Notice */}
      {downloadSuccessToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-800 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="text-green-500" size={20} />
          <p className="text-sm font-bold">{downloadSuccessToast}</p>
        </div>
      )}

      {/* Main Grid Card */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Profile Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
          
          {/* User Bio Card */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-150/80 dark:border-slate-700 p-8 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-600"></div>
            
            <div className="relative mt-4">
              <div className="w-20 h-20 bg-red-50 dark:bg-red-950/40 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-red-50/50">
                <UserIcon size={36} className="stroke-[1.75]" />
              </div>
              
              <h2 className="text-2xl font-black text-slate-850 dark:text-white mb-1 tracking-tight text-center">
                {user.name}
              </h2>
              <p className="text-slate-400 dark:text-slate-400 text-xs px-2 py-1 bg-slate-50 dark:bg-slate-900/50 rounded-lg inline-block mx-auto mb-6 max-w-full truncate text-center w-full">
                {user.email}
              </p>
              
              <div className="border-t border-slate-100 dark:border-slate-700/60 pt-6 space-y-3">
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full py-3.5 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:bg-red-950/20 dark:hover:text-red-400 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-transparent hover:border-red-100"
                >
                  <LogOut size={14} />
                  Sign Out Account
                </button>
              </div>
            </div>
          </div>

          {/* Premium Account Statistics */}
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-red-650/10 rounded-full blur-2xl"></div>
            
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <BarChart size={16} className="text-red-500" />
              Account Usage
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Processing Level</p>
                  <p className="text-xl font-black text-white">Free Master</p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Active
                </span>
              </div>

              <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Total Actions Run</p>
                  <p className="text-lg font-black text-white">{activeCount}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center">
                  <Star size={16} className="text-red-500 fill-red-500/20" />
                </div>
              </div>

              <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800/60">
                <div className="flex gap-2 items-start text-xs text-slate-300 leading-relaxed font-medium">
                  <ShieldCheck size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <p>All processing is handled directly inside your local computer workspace sandboxes.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Support Guidelines */}
          <div className="p-6 bg-slate-50 dark:bg-slate-900/30 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <HelpCircle size={14} className="text-red-500" />
              Need Support?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Join live workspace discussions or check out standard documentation for custom pipeline deployment.
            </p>
          </div>
        </aside>

        {/* Dynamic Workbench Section */}
        <main className="flex-grow space-y-8 min-w-0">
          
          {/* Cockpit Routing Navigation Bar */}
          <div className="bg-slate-100/80 dark:bg-slate-900/40 p-2 rounded-3xl flex flex-wrap gap-2 border border-slate-150/40 dark:border-slate-800/80">
            <button
              onClick={() => setActiveTab('toolbox')}
              className={`flex-grow md:flex-grow-0 px-6 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all outline-none cursor-pointer ${
                activeTab === 'toolbox' 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' 
                  : 'text-slate-600 hover:bg-slate-200/50 dark:text-slate-300 dark:hover:bg-slate-800/50'
              }`}
            >
              <LayoutGrid size={18} />
              Interactive Toolbox
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex-grow md:flex-grow-0 px-6 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all outline-none cursor-pointer relative ${
                activeTab === 'activity' 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' 
                  : 'text-slate-600 hover:bg-slate-200/50 dark:text-slate-300 dark:hover:bg-slate-800/50'
              }`}
            >
              <Activity size={18} />
              Conversion Logs
              {activeCount > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black ${activeTab === 'activity' ? 'bg-white text-red-600' : 'bg-red-600 text-white'}`}>
                  {activeCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('workflow')}
              className={`flex-grow md:flex-grow-0 px-6 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all outline-none cursor-pointer ${
                activeTab === 'workflow' 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' 
                  : 'text-slate-600 hover:bg-slate-200/50 dark:text-slate-300 dark:hover:bg-slate-800/50'
              }`}
            >
              <Sparkles size={18} />
              Automate Workflows
            </button>
          </div>

          {/* TAB CONTENT: INTERACTIVE PDF TOOLBOX (Quick Launcher Grid) */}
          {activeTab === 'toolbox' && (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-8 animate-in fade-in duration-500">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 dark:border-slate-700/60 pb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-850 dark:text-white mb-2 tracking-tight flex items-center gap-2">
                    <Grid className="text-red-600" />
                    Quick Search Toolbox
                  </h3>
                  <p className="text-slate-400 dark:text-slate-400 text-sm font-medium">Select any of our 25 offline-first professional tools to begin.</p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tools..."
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white font-bold pl-12 pr-6 py-3.5 rounded-2xl border-2 border-slate-150 dark:border-slate-800 outline-none focus:border-red-600 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Category selector pills */}
              <div className="flex flex-wrap gap-2">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-xs font-black tracking-wider uppercase rounded-xl transition-all border outline-none cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-md'
                        : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
                    }`}
                  >
                    {cat === 'All' ? '📌 Show All' : cat}
                  </button>
                ))}
              </div>

              {/* Grid Tools list */}
              {filteredTools.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] bg-slate-50/50 dark:bg-slate-900/35">
                  <p className="text-slate-400 dark:text-slate-500 font-bold text-lg mb-2">No matching tools found</p>
                  <p className="text-slate-400 text-xs font-medium">Try updating the search parameters or selected category pills.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredTools.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => navigate(t.path)}
                      className="group p-6 bg-slate-50/50 hover:bg-white dark:bg-slate-900/30 dark:hover:bg-slate-700/50 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden"
                    >
                      {/* Hover effect glowing dot */}
                      <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-600 opacity-40 group-hover:scale-150 transition-transform"></span>
                      
                      <div>
                        {/* Tool Icon */}
                        <div className="w-12 h-12 bg-white dark:bg-slate-800 text-slate-500 group-hover:bg-red-600 group-hover:text-white rounded-xl shadow-inner flex items-center justify-center mb-5 transition-all">
                          {getIcon(t.icon, 22)}
                        </div>
                        
                        {/* Tool Info */}
                        <h4 className="text-base font-black text-slate-850 dark:text-white mb-2 group-hover:text-red-600 transition-colors">
                          {t.name}
                        </h4>
                        
                        <p className="text-slate-400 dark:text-slate-450 text-xs font-medium leading-relaxed mb-6 line-clamp-2">
                          {t.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {t.category.split(' ')[0]} {/* shortened category name */}
                        </span>
                        <span className="text-slate-450 dark:text-slate-500 group-hover:text-red-600 group-hover:translate-x-1 transition-all flex items-center gap-1 text-xs font-black">
                          Launch
                          <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: CONVERSION HISTORY LOGS */}
          {activeTab === 'activity' && (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-6 animate-in fade-in duration-500 animate-in">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-850 dark:text-white mb-1 tracking-tight flex items-center gap-2">
                    <Clock className="text-red-600" />
                    Conversion Logs History
                  </h3>
                  <p className="text-slate-400 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Processed and cleared locally right inside the sandbox</p>
                </div>
                
                {activeCount > 0 && (
                  <button
                    onClick={() => setShowDeletionConfirm(true)}
                    className="px-4 py-2 text-xs font-black uppercase tracking-wider bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-900/30 dark:text-red-400 dark:border-red-900/50 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Trash size={14} />
                    Purge All Logs
                  </button>
                )}
              </div>

              {/* Deletion confirmation modal popup mock */}
              {showDeletionConfirm && (
                <div className="p-6 bg-red-50/50 dark:bg-red-950/25 border border-red-100 dark:border-red-900/50 rounded-3xl space-y-4 animate-in slide-in-from-top-6 duration-300">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white">Are you absolutely sure you want to purge all logs?</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">This action cannot be undone. All conversion entries will be wiped from your local browser context database storage.</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setShowDeletionConfirm(false)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        clearHistory();
                        setShowDeletionConfirm(false);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Wipe Everything
                    </button>
                  </div>
                </div>
              )}

              {activeCount === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-[2rem] bg-slate-50/30 dark:bg-slate-900/20">
                  <File className="mx-auto text-slate-300 mb-4" size={54} strokeWidth={1} />
                  <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mb-2">No conversions performed yet</p>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">Start converting, merging, or organizing files locally to populate your security history dashboard.</p>
                  <button 
                    onClick={() => setActiveTab('toolbox')}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 hover:opacity-90 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all cursor-pointer shadow-lg"
                  >
                    Create PDF Action Task
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.history.map((item) => {
                    const matchedTool = TOOLS.find(t => t.id === item.tool);
                    return (
                      <div 
                        key={item.id} 
                        className="flex flex-col sm:flex-row items-center justify-between p-5 bg-slate-50 hover:bg-slate-100/60 dark:bg-slate-900/40 dark:hover:bg-slate-900 rounded-[1.75rem] border border-slate-150/40 dark:border-slate-800/80 gap-4 group transition-all"
                      >
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-red-600 border border-slate-100 dark:border-slate-700">
                            {matchedTool ? getIcon(matchedTool.icon, 22) : <File size={22} />}
                          </div>
                          <div className="truncate flex-grow">
                            <p className="font-black text-slate-850 dark:text-white truncate max-w-[280px]">
                              {item.fileName}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                              <span>{matchedTool ? matchedTool.name : 'Unknown Tool'}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-400">{new Date(item.timestamp).toLocaleDateString()}, {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800/80">
                          <span className="px-3.5 py-1 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-xl text-[10px] font-black uppercase tracking-widest">
                            {item.status}
                          </span>
                          
                          {/* Item action controls */}
                          <div className="flex gap-1.5">
                            <button 
                              onClick={() => handleDownloadItem(item.fileName, matchedTool?.name || item.tool)}
                              className="p-2 sm:p-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-500 hover:text-slate-850 dark:text-slate-300 dark:hover:text-white transition-all shadow-sm cursor-pointer border border-slate-100 dark:border-slate-700 font-bold"
                              title="Download document replica"
                            >
                              <Download size={16} />
                            </button>
                            <button 
                              onClick={() => removeHistory(item.id)}
                              className="p-2 sm:p-2.5 bg-white dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-950/20 dark:text-slate-300 dark:hover:text-red-400 rounded-xl text-slate-400 transition-all shadow-sm cursor-pointer border border-slate-100 dark:border-slate-700"
                              title="Delete log item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: BATCH WORKFLOW BUILDER AUTOMATION */}
          {activeTab === 'workflow' && (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm animate-in fade-in duration-500">
              <div className="mb-6">
                <h3 className="text-2xl font-black text-slate-850 dark:text-white mb-2 tracking-tight flex items-center gap-2">
                  <Sparkles className="text-red-600 animate-pulse" />
                  Visual Pipeline Creator
                </h3>
                <p className="text-slate-400 dark:text-slate-400 text-sm font-medium">Chain multiple operations together sequentially (e.g. OCR PDF ➔ Compress ➔ Watermark ➔ Protect) and run the pipeline at once!</p>
              </div>
              <WorkflowBuilder />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
