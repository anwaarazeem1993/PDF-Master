
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import SEO from '../components/SEO';

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signup(name, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <SEO title="Create Account" description="Join PDF Master today and get unlimited access to all professional PDF tools for free." />
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Create Account</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Join thousands of users converting PDFs daily</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-red-600 transition-colors">
                  <UserIcon size={18} />
                </div>
                <input 
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-red-600/10 focus:border-red-600 transition-all dark:text-white font-medium"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-red-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-red-600/10 focus:border-red-600 transition-all dark:text-white font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-red-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-red-600/10 focus:border-red-600 transition-all dark:text-white font-medium"
                  placeholder="Min. 6 characters"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl border border-red-100 dark:border-red-800">
                <AlertCircle size={18} />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            <button 
              type="submit" disabled={loading}
              className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-xl mt-6 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <>Sign Up <ChevronRight size={20} /></>}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500 dark:text-slate-400 font-medium">
            Already have an account? <Link to="/login" className="text-red-600 font-bold hover:underline">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
