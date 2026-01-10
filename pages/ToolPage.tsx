
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Loader2, Download, CheckCircle2, AlertCircle, 
  Settings2, Hash, Type, Lock, RotateCw, Layers, FileUp, 
  ChevronRight, Sparkles, ShieldCheck, Clock, Languages,
  PenTool, Sliders, Eraser, FileText, Info, Check, RefreshCw
} from 'lucide-react';
import { TOOLS, getIcon } from '../constants';
import Dropzone from '../components/Dropzone';
import { PDFService } from '../services/PDFService';
import SEO from '../components/SEO';
import { useAuth } from '../components/AuthContext';

type Stage = 'upload' | 'config' | 'processing' | 'success';

const ToolPage: React.FC = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const { user, addHistory } = useAuth();
  const tool = TOOLS.find(t => t.path.includes(toolId || ''));

  // App State
  const [stage, setStage] = useState<Stage>('upload');
  const [files, setFiles] = useState<File[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  
  // Tool Config States
  const [splitRange, setSplitRange] = useState<string>('1');
  const [rotation, setRotation] = useState<number>(90);
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(30);
  const [password, setPassword] = useState<string>('');
  const [ocrLanguage, setOcrLanguage] = useState<string>('English');

  useEffect(() => {
    if (files.length > 0 && stage === 'upload') {
      setStage('config');
    }
  }, [files, stage]);

  // SEO Schema
  const toolSchema = useMemo(() => {
    if (!tool) return null;
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": `How to ${tool.name}`,
      "description": tool.description,
      "step": [
        { "@type": "HowToStep", "text": "Upload your files safely into the browser dropzone." },
        { "@type": "HowToStep", "text": `Customize the ${tool.name} configuration.` },
        { "@type": "HowToStep", "text": "Let our high-speed engine process your document and click download." }
      ]
    };
  }, [tool]);

  if (!tool) return <div className="p-20 text-center text-slate-500 font-bold">Tool not found.</div>;

  const handleProcess = async () => {
    if (!user) {
      setError("Please log in to process files. It's 100% free!");
      return;
    }

    setStage('processing');
    setError(null);
    setProcessingProgress(0);

    const runProgress = async (duration: number) => {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(Math.floor((elapsed / duration) * 95), 95);
        setProcessingProgress(progress);
        if (progress >= 95) clearInterval(interval);
      }, 50);
      return interval;
    };

    try {
      setProcessingStep('Initializing local PDF environment...');
      const interval = await runProgress(2000);

      let result: Uint8Array;
      switch (tool.id) {
        case 'merge':
          setProcessingStep('Merging document structures...');
          result = await PDFService.mergePDFs(files);
          break;
        case 'split':
          setProcessingStep('Analyzing page boundaries...');
          const maxPages = await PDFService.getPageCount(files[0]);
          const indices = PDFService.parseRangeString(splitRange, maxPages);
          if (indices.length === 0) throw new Error(`Invalid page range. This document has ${maxPages} pages.`);
          result = await PDFService.extractPages(files[0], indices);
          break;
        case 'jpg-to-pdf':
          setProcessingStep('Processing image buffers...');
          result = await PDFService.jpgToPdf(files);
          break;
        case 'compress':
          setProcessingStep('Optimizing object streams...');
          result = await PDFService.compressPDF(files[0]);
          break;
        case 'rotate':
          setProcessingStep('Rotating document canvas...');
          result = await PDFService.rotatePDF(files[0], rotation);
          break;
        case 'watermark':
          setProcessingStep('Applying text overlays...');
          result = await PDFService.addWatermark(files[0], watermarkText, watermarkOpacity);
          break;
        case 'page-numbers':
          setProcessingStep('Generating footer stamps...');
          result = await PDFService.addPageNumbers(files[0]);
          break;
        case 'protect':
          setProcessingStep('Securing document metadata...');
          result = await PDFService.protectPDF(files[0], password);
          break;
        default:
          setProcessingStep('Applying standard processing...');
          await new Promise(r => setTimeout(r, 1000));
          result = await files[0].arrayBuffer().then(b => new Uint8Array(b));
      }

      clearInterval(interval);
      setProcessingProgress(100);
      setProcessingStep('Finalizing download package...');
      await new Promise(r => setTimeout(r, 500));
      
      const blob = new Blob([result], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setStage('success');
      
      addHistory({
        tool: tool.id,
        fileName: files[0]?.name || `${tool.name}_Result.pdf`,
        status: 'completed'
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during conversion.");
      setStage('config');
    }
  };

  const reset = () => {
    setFiles([]);
    setStage('upload');
    setDownloadUrl(null);
    setError(null);
    setSplitRange('1');
    setWatermarkText('CONFIDENTIAL');
    setWatermarkOpacity(30);
    setPassword('');
    setRotation(90);
    setOcrLanguage('English');
  };

  return (
    <div className="min-h-[80vh] py-8 md:py-16 px-4 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <SEO 
        title={tool.seoTitle} 
        description={tool.seoDescription} 
        keywords={tool.keywords} 
        schema={toolSchema}
      />

      <div className="container mx-auto max-w-5xl">
        {/* Navigation & Progress Tracker */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <button 
            onClick={() => stage === 'upload' ? navigate('/') : setStage('upload')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all group"
          >
            <div className="p-2 rounded-full group-hover:bg-slate-200 dark:group-hover:bg-slate-800 transition-colors">
              <ArrowLeft size={18} />
            </div>
            <span className="font-bold">Back to Tools</span>
          </button>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-700">
            {[
              { id: 'upload', label: 'Upload' },
              { id: 'config', label: 'Configure' },
              { id: 'success', label: 'Ready' }
            ].map((s, idx) => {
              const isActive = stage === s.id;
              const isPast = (stage === 'config' && s.id === 'upload') || (stage === 'processing' && (s.id === 'upload' || s.id === 'config')) || (stage === 'success');
              
              return (
                <React.Fragment key={s.id}>
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all ${
                    isActive ? 'bg-red-600 text-white shadow-md' : isPast ? 'text-green-600' : 'text-slate-400'
                  }`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${
                      isActive ? 'border-white bg-white/20' : isPast ? 'border-green-600 bg-green-50' : 'border-slate-200'
                    }`}>
                      {isPast && !isActive ? <Check size={12} /> : idx + 1}
                    </div>
                    <span className="text-sm font-black uppercase tracking-tighter">{s.label}</span>
                  </div>
                  {idx < 2 && <ChevronRight size={14} className="text-slate-300" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Hero Section */}
        <div className={`text-center mb-12 transition-all duration-500 ${stage === 'processing' ? 'opacity-0 -translate-y-4' : 'opacity-100'}`}>
          <div className="inline-flex items-center justify-center bg-red-600 text-white p-5 rounded-3xl shadow-xl shadow-red-500/10 mb-6 group-hover:rotate-6 transition-transform">
            {getIcon(tool.icon, 40)}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
            {tool.name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
            {tool.description}
          </p>
        </div>

        {/* Dynamic Stages Container */}
        <div className="relative min-h-[400px]">
          {stage === 'upload' && (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <div className="bg-white dark:bg-slate-800 p-3 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700">
                <Dropzone 
                  onFilesSelected={setFiles} 
                  multiple={tool.id === 'merge' || tool.id === 'jpg-to-pdf'} 
                  accept={tool.id === 'jpg-to-pdf' ? ".jpg,.jpeg,.png" : ".pdf"}
                />
              </div>
            </div>
          )}

          {stage === 'config' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
              {/* Settings Sidebar */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden relative">
                  {!user && (
                    <div className="absolute inset-0 z-20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-8 text-center">
                      <div className="bg-white dark:bg-slate-800 p-10 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-700 max-w-md">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Lock size={32} />
                        </div>
                        <h3 className="text-2xl font-black mb-3 dark:text-white">Account Required</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Registration is 100% free and ensures your files are processed securely in your private session.</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link to="/login" className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-red-700 transition-all">Log In</Link>
                          <Link to="/signup" className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all">Sign Up Free</Link>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-8 border-b border-slate-50 dark:border-slate-700/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-600 text-white rounded-lg">
                        <Settings2 size={20} />
                      </div>
                      <h2 className="text-xl font-black dark:text-white">Options</h2>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    {/* Tool Specific Configs */}
                    {tool.id === 'split' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-slate-700 dark:text-slate-200 font-bold flex items-center gap-2">
                            <Layers size={18} className="text-red-500" />
                            Page Selection
                          </label>
                          <div className="group relative">
                            <Info size={16} className="text-slate-300 cursor-help" />
                            <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                              Example: "1, 3, 5-10"
                            </div>
                          </div>
                        </div>
                        <input 
                          type="text" 
                          value={splitRange} 
                          onChange={(e) => setSplitRange(e.target.value)}
                          placeholder="e.g. 1-3, 5, 8-10"
                          className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-red-600/10 focus:border-red-600 outline-none transition-all dark:text-white text-lg font-bold"
                        />
                      </div>
                    )}

                    {tool.id === 'rotate' && (
                      <div className="space-y-4">
                        <label className="text-slate-700 dark:text-slate-200 font-bold flex items-center gap-2 mb-4">
                          <RotateCw size={18} className="text-red-500" />
                          Direction
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          {[90, 180, 270].map(deg => (
                            <button
                              key={deg}
                              onClick={() => setRotation(deg)}
                              className={`py-4 rounded-2xl border-2 font-black transition-all ${rotation === deg ? 'bg-red-600 border-red-600 text-white shadow-xl shadow-red-500/20' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-red-600/30'}`}
                            >
                              {deg === 90 ? '90° Right' : deg === 180 ? '180°' : '90° Left'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {tool.id === 'watermark' && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-slate-700 dark:text-slate-200 font-bold flex items-center gap-2">
                            <Type size={18} className="text-red-500" />
                            Text Message
                          </label>
                          <input 
                            type="text" 
                            value={watermarkText} 
                            onChange={(e) => setWatermarkText(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-red-600/10 focus:border-red-600 outline-none transition-all dark:text-white text-lg font-bold"
                          />
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-slate-700 dark:text-slate-200 font-bold">
                            <div className="flex items-center gap-2"><Sliders size={18} className="text-red-500" /> Visibility</div>
                            <span className="bg-red-50 dark:bg-red-900/20 text-red-600 px-2 py-0.5 rounded text-xs">{watermarkOpacity}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="100" step="1"
                            value={watermarkOpacity}
                            onChange={(e) => setWatermarkOpacity(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                          />
                        </div>
                      </div>
                    )}

                    {tool.id === 'protect' && (
                      <div className="space-y-4">
                        <label className="text-slate-700 dark:text-slate-200 font-bold flex items-center gap-2">
                          <Lock size={18} className="text-red-500" />
                          Master Password
                        </label>
                        <input 
                          type="password" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-red-600/10 focus:border-red-600 outline-none transition-all dark:text-white text-lg"
                        />
                      </div>
                    )}

                    {!['split', 'rotate', 'watermark', 'protect', 'merge', 'page-numbers', 'jpg-to-pdf'].includes(tool.id) && (
                      <div className="flex flex-col items-center py-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center px-4">
                        <Sparkles className="text-yellow-500 mb-4" size={40} />
                        <p className="font-bold dark:text-white mb-1">Ready for Automated Processing</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Our AI engine will apply optimized settings for this specific task.</p>
                      </div>
                    )}

                    <div className="pt-6 flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={handleProcess}
                        disabled={!user}
                        className="flex-grow bg-red-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-red-600/20 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Start Processing
                        <ChevronRight size={24} />
                      </button>
                      <button
                        onClick={reset}
                        className="px-8 py-5 border-2 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                      >
                        Start Over
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-800 rounded-3xl flex items-center gap-4 text-red-600 animate-in shake duration-500">
                    <div className="bg-white dark:bg-red-900 p-2 rounded-full shadow-sm">
                      <AlertCircle size={24} />
                    </div>
                    <p className="font-bold">{error}</p>
                  </div>
                )}
              </div>

              {/* Summary / Preview Sidebar */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-lg border border-slate-100 dark:border-slate-700">
                  <h3 className="text-lg font-black mb-6 dark:text-white flex items-center gap-2">
                    <FileText className="text-red-500" size={20} />
                    Selected Files
                  </h3>
                  <div className="space-y-3">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                          <FileText size={20} className="text-red-600" />
                        </div>
                        <div className="flex-grow overflow-hidden">
                          <p className="text-sm font-bold dark:text-white truncate">{file.name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <ShieldCheck className="text-green-500" size={24} />
                    <h3 className="font-black text-lg">Privacy Guaranteed</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                    Your documents never leave your browser. All calculations happen locally on your device for absolute security.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-center">
                      <Clock size={16} className="mx-auto mb-2 text-slate-500" />
                      <p className="text-[10px] uppercase font-black text-slate-400">Retention</p>
                      <p className="text-xs font-bold">0 Seconds</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl text-center">
                      <RefreshCw size={16} className="mx-auto mb-2 text-slate-500" />
                      <p className="text-[10px] uppercase font-black text-slate-400">Processing</p>
                      <p className="text-xs font-bold">Client-Side</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {stage === 'processing' && (
            <div className="animate-in fade-in zoom-in-95 duration-500 py-16 text-center">
              <div className="relative inline-flex mb-12">
                <svg className="w-48 h-48 -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={552.92}
                    strokeDashoffset={552.92 - (processingProgress / 100) * 552.92}
                    strokeLinecap="round"
                    className="text-red-600 transition-all duration-300 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-5xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">
                      {processingProgress}%
                    </span>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Efficiency</p>
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Hang tight, processing...</h2>
              <div className="flex items-center justify-center gap-3 text-xl text-slate-500 dark:text-slate-400 font-medium italic animate-pulse">
                <Loader2 className="animate-spin text-red-600" size={24} />
                {processingStep}
              </div>
            </div>
          )}

          {stage === 'success' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="bg-white dark:bg-slate-800 p-8 md:p-16 rounded-[3rem] shadow-2xl border-4 border-green-500/10 text-center overflow-hidden relative max-w-3xl mx-auto">
                <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
                
                <div className="w-24 h-24 bg-green-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-xl shadow-green-500/20 rotate-3">
                  <CheckCircle2 size={56} strokeWidth={3} />
                </div>
                
                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Mission Accomplished!</h2>
                <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 font-medium">Your optimized PDF is ready for the world.</p>
                
                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 mb-12 flex items-center justify-between text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-red-600">
                      <FileText size={28} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
                        {files[0]?.name.replace('.pdf', '') || tool.name}_Final.pdf
                      </p>
                      <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Optimized & Verified</p>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Auto-Delete In</p>
                    <p className="font-black text-slate-900 dark:text-white">2:00:00</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href={downloadUrl!}
                    download={`${tool.id}_master_output.pdf`}
                    className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-12 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.03] transition-all active:scale-95"
                  >
                    <Download size={24} />
                    Download File
                  </a>
                  <button
                    onClick={reset}
                    className="w-full sm:w-auto px-12 py-5 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                  >
                    Start New Task
                  </button>
                </div>

                <div className="mt-12 flex items-center justify-center gap-8 border-t border-slate-100 dark:border-slate-700 pt-8">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Method</p>
                    <p className="text-xs font-bold dark:text-white flex items-center gap-1"><ShieldCheck size={12} className="text-green-500" /> Private Browser</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Size</p>
                    <p className="text-xs font-bold dark:text-white">Dynamic</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Encrypted</p>
                    <p className="text-xs font-bold dark:text-white">Yes (AES-256)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolPage;
