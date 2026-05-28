
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Loader2, Download, CheckCircle2, AlertCircle, 
  Settings2, Lock, RotateCw, Layers, ChevronRight, Sparkles, ShieldCheck, Clock, FileText, Check, RefreshCw, HelpCircle, Info
} from 'lucide-react';
import { TOOLS, getIcon, TOOL_CONTENT } from '../constants.tsx';
import Dropzone from '../components/Dropzone.tsx';
import { PDFService } from '../services/PDFService.ts';
import SEO from '../components/SEO.tsx';
import { useAuth } from '../components/AuthContext.tsx';

import Breadcrumb from '../components/Breadcrumb.tsx';

type Stage = 'upload' | 'config' | 'processing' | 'success';

const ToolPage: React.FC = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const { user, addHistory } = useAuth();
  
  // Find tool based on URL path mapping
  const tool = TOOLS.find(t => t.path.includes(toolId || ''));

  const [stage, setStage] = useState<Stage>('upload');
  const [files, setFiles] = useState<File[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [splitRange, setSplitRange] = useState<string>('1');
  const [rotation, setRotation] = useState<number>(90);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const extraContent = tool ? TOOL_CONTENT[tool.id] : null;

  useEffect(() => {
    if (files.length > 0 && stage === 'upload') {
      setStage('config');
    }
  }, [files, stage]);

  useEffect(() => {
    if (files.length > 0) {
      if (files[0].type === 'application/pdf' || files[0].type.startsWith('image/')) {
        const url = URL.createObjectURL(files[0]);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      }
    } else {
      setPreviewUrl(null);
    }
  }, [files]);


  if (!tool) return <div className="p-20 text-center text-slate-500 font-bold">Tool not found.</div>;

  const handleProcess = async () => {
    if (!user) {
      setError("Please log in to process files. It's 100% free!");
      return;
    }

    setStage('processing');
    setError(null);
    setProcessingProgress(0);

    try {
      let result: Uint8Array;
      // Actual browser-side PDF processing
      switch (tool.id) {
        case 'merge':
          result = await PDFService.mergePDFs(files);
          break;
        case 'split':
          const maxPages = await PDFService.getPageCount(files[0]);
          const indices = PDFService.parseRangeString(splitRange, maxPages);
          result = await PDFService.extractPages(files[0], indices);
          break;
        case 'jpg-to-pdf':
          result = await PDFService.jpgToPdf(files);
          break;
        case 'compress':
          result = await PDFService.compressPDF(files[0]);
          break;
        case 'rotate':
          result = await PDFService.rotatePDF(files[0], rotation);
          break;
        default:
          // Fallback: return original as bytes
          result = new Uint8Array(await files[0].arrayBuffer());
      }

      setProcessingProgress(100);
      const blob = new Blob([result], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setStage('success');
      addHistory({ 
        tool: tool.id, 
        fileName: files[0]?.name || `${tool.name}.pdf`, 
        status: 'completed' 
      });
    } catch (err: any) {
      setError(err.message || "An error occurred during processing.");
      setStage('config');
    }
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to use ${tool.name}`,
    "description": tool.description,
    "step": extraContent?.steps.map((s, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "text": s
    })) || []
  };

  return (
    <div className="min-h-screen py-8 md:py-16 px-4 bg-slate-50 dark:bg-slate-900 transition-colors">
      <SEO 
        title={tool.seoTitle} 
        description={tool.seoDescription}
        keywords={tool.keywords}
        schema={schema}
      />

      <div className="max-w-5xl mx-auto">
        {/* Breadcrumbs */}
        <Breadcrumb items={[
          { label: tool.category },
          { label: tool.name }
        ]} />

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-5 bg-red-600 text-white rounded-[2rem] shadow-2xl mb-8 animate-in zoom-in duration-700">
            {getIcon(tool.icon, 48)}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
            {tool.name}
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            {tool.description}
          </p>
        </div>

        {/* Main Interface */}
        <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-700 p-8 md:p-12 mb-16 relative overflow-hidden">
          
          {stage === 'upload' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <Dropzone 
                onFilesSelected={setFiles} 
                multiple={tool.id === 'merge' || tool.id === 'jpg-to-pdf'}
                accept={tool.id === 'jpg-to-pdf' ? '.pdf,.jpg,.jpeg,.png' : '.pdf'}
              />
            </div>
          )}

          {stage === 'config' && (
            <div className="animate-in fade-in zoom-in duration-500 max-w-xl mx-auto">
              {previewUrl && (
                <div className="mb-8 rounded-[2rem] overflow-hidden border-4 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 aspect-[1/1.3] shadow-inner relative group">
                  {files[0].type === 'application/pdf' ? (
                    <embed src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`} type="application/pdf" className="w-full h-full object-contain pointer-events-none" />
                  ) : (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain pointer-events-none" />
                  )}
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-[2rem] pointer-events-none"></div>
                  <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl">Document Preview</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm">
                  <FileText className="text-red-600" />
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    {files.length} {files.length === 1 ? 'file' : 'files'} selected
                  </p>
                  <button onClick={() => setStage('upload')} className="text-xs font-black text-red-600 hover:underline uppercase tracking-widest">Change selection</button>
                </div>
              </div>

              {/* Tool Specific Configs */}
              <div className="space-y-6 mb-10">
                {tool.id === 'split' && (
                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
                      <Settings2 size={16} className="text-red-600" />
                      Page Range
                    </label>
                    <input 
                      type="text" 
                      value={splitRange} 
                      onChange={(e) => setSplitRange(e.target.value)}
                      placeholder="e.g. 1-5, 8, 10-12"
                      className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 focus:border-red-600 outline-none dark:text-white font-bold text-lg transition-all"
                    />
                  </div>
                )}
                {tool.id === 'rotate' && (
                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
                      <RotateCw size={16} className="text-red-600" />
                      Rotation Angle
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[90, 180, 270].map(deg => (
                        <button 
                          key={deg}
                          onClick={() => setRotation(deg)}
                          className={`py-4 rounded-xl font-bold transition-all border-2 ${rotation === deg ? 'bg-red-600 text-white border-red-600 shadow-lg' : 'bg-slate-50 dark:bg-slate-900 border-transparent dark:text-white hover:border-slate-200'}`}
                        >
                          {deg}°
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl flex items-center gap-3 text-red-600 animate-in shake duration-500">
                  <AlertCircle size={20} />
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}

              <button 
                onClick={handleProcess}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-[1.5rem] font-black text-xl hover:opacity-90 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95"
              >
                <Sparkles size={24} className="text-red-500" />
                Process PDF
              </button>
            </div>
          )}

          {stage === 'processing' && (
            <div className="text-center py-20 animate-in fade-in duration-500">
              <div className="relative inline-block mb-8">
                <Loader2 size={80} className="text-red-600 animate-spin" strokeWidth={1.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-black text-slate-900 dark:text-white">{Math.round(processingProgress)}%</span>
                </div>
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Processing your files</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Wait a moment, everything is happening in your browser.</p>
            </div>
          )}

          {stage === 'success' && downloadUrl && (
            <div className="text-center py-10 animate-in zoom-in duration-700">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Success!</h3>
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 font-medium">Your PDF is ready for download.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href={downloadUrl} 
                  download={`${tool.id}_result.pdf`}
                  className="bg-red-600 text-white px-10 py-5 rounded-[1.5rem] font-black text-xl hover:bg-red-700 transition-all shadow-2xl flex items-center gap-3 group"
                >
                  <Download size={24} className="group-hover:translate-y-1 transition-transform" />
                  Download PDF
                </a>
                <button 
                  onClick={() => {
                    setStage('upload');
                    setFiles([]);
                    setDownloadUrl(null);
                  }}
                  className="px-10 py-5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white rounded-[1.5rem] font-black text-xl hover:bg-slate-200 transition-all flex items-center gap-3"
                >
                  <RefreshCw size={24} />
                  Start Over
                </button>
              </div>

              <div className="mt-16 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center gap-6 max-w-md mx-auto">
                <ShieldCheck className="text-green-600" size={32} />
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-white">Privacy Guaranteed</p>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Files never leave your device. Processing is 100% serverless.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-20">
          <div className="space-y-8">
            <div>
              <h2 className="text-sm font-black text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info size={16} />
                Instructions
              </h2>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-6">How to {tool.name.toLowerCase()}</h3>
              <div className="space-y-4">
                {extraContent?.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="flex-shrink-0 w-8 h-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg flex items-center justify-center font-black text-sm">
                      {idx + 1}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-sm font-black text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <HelpCircle size={16} />
                FAQs
              </h2>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h3>
              <div className="space-y-6">
                {extraContent?.faqs.map((faq, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                      {faq.q}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed pl-3.5">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="mt-24 p-12 bg-slate-900 dark:bg-white rounded-[3rem] text-center text-white dark:text-slate-900 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000"></div>
          <h2 className="text-3xl font-black mb-4 tracking-tight">Need more PDF power?</h2>
          <p className="text-slate-400 dark:text-slate-500 font-bold mb-8 uppercase tracking-widest text-xs">Unlock all tools with a free account</p>
          <Link 
            to="/signup" 
            className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            Create Free Account
            <ArrowLeft size={20} className="rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ToolPage;
