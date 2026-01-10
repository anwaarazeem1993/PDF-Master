
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, File, Trash2, Download, Settings, User as UserIcon, BarChart } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { TOOLS, getIcon } from '../constants';
import SEO from '../components/SEO';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-700">
      <SEO title="User Dashboard" description="Manage your PDF conversions and history." />
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-80 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm text-center">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserIcon size={48} />
            </div>
            <h2 className="text-2xl font-black dark:text-white mb-1">{user.name}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{user.email}</p>
            <button 
              onClick={logout}
              className="w-full py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-red-50 hover:text-red-600 transition-all"
            >
              Log Out
            </button>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BarChart size={20} className="text-red-500" />
              Usage Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Tools Used</span>
                <span className="font-bold">{user.history.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Account Status</span>
                <span className="text-green-400 font-bold uppercase text-xs tracking-widest">Free Master</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow space-y-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black dark:text-white flex items-center gap-3">
                <Clock className="text-red-600" />
                Processing History
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Files auto-deleted after 2h</p>
            </div>

            {user.history.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-3xl">
                <File className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-slate-500 dark:text-slate-400 font-medium">No history found. Start converting!</p>
                <button 
                  onClick={() => navigate('/')}
                  className="mt-6 text-red-600 font-bold hover:underline"
                >
                  Explore PDF Tools
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {user.history.map((item) => {
                  const tool = TOOLS.find(t => t.id === item.tool);
                  return (
                    <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 gap-4 group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-red-600">
                          {tool ? getIcon(tool.icon, 24) : <File size={24} />}
                        </div>
                        <div>
                          <p className="font-bold dark:text-white truncate max-w-[200px]">{item.fileName}</p>
                          <p className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.status}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors">
                            <Download size={18} />
                          </button>
                          <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-500 hover:text-red-600 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
