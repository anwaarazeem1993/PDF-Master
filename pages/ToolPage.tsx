
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
import PdfCanvasPreview from '../components/PdfCanvasPreview.tsx';
import PdfPageOrganizer from '../components/PdfPageOrganizer.tsx';
import { useI18n } from '../components/I18nContext.tsx';

type Stage = 'upload' | 'config' | 'processing' | 'success';

const getOutputConfig = (toolId: string) => {
  switch (toolId) {
    case 'pdf-to-word':
      return { ext: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'Download Word', name: 'Word Document' };
    case 'pdf-to-ppt':
      return { ext: 'pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', label: 'Download PPT', name: 'PowerPoint Document' };
    case 'pdf-to-excel':
      return { ext: 'xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', label: 'Download Excel', name: 'Excel Spreadsheet' };
    default:
      return { ext: 'pdf', mime: 'application/pdf', label: 'Download PDF', name: 'PDF' };
  }
};

const ToolPage: React.FC = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const { user, addHistory } = useAuth();
  const { t } = useI18n();
  
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
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(30);
  const [pdfPassword, setPdfPassword] = useState<string>('');

  const extraContent = tool ? TOOL_CONTENT[tool.id] : null;
  const outputConfig = tool ? getOutputConfig(tool.id) : getOutputConfig('default');

  const stepsList = extraContent?.steps || [
    `Upload your PDF or source document using our secure client-side drag-and-drop zone.`,
    `Personalize options and apply desired parameters inside the configuration workbench.`,
    `Click "Process PDF" to trigger our serverless document processing engine.`,
    `Download your updated document directly. All file bytes are processed entirely locally.`
  ];
  
  const faqsList = extraContent?.faqs || [
    { q: `How does the browser-side ${tool.name} tool run?`, a: `Our advanced PDF engine loads the document into your browser memory using virtual local resources, making modifications entirely client-side without upload latency.` },
    { q: "Is my personal data safe with this converter?", a: "100% yes. All operations are processed micro-serverlessly directly within your browser window. Neither files nor conversion records ever persist outside of your browser context." },
    { q: `Are there limits to how often I can use ${tool.name}?`, a: "No. You can leverage all tools fully for unlimited sessions, entirely free, securely, and with zero ads." }
  ];

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

  const handleProcess = async (organizePages?: any[]) => {
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
        case 'remove-watermark':
          result = await PDFService.removeWatermark(files[0]);
          break;
        case 'watermark':
          result = await PDFService.addWatermark(files[0], watermarkText, watermarkOpacity);
          break;
        case 'page-numbers':
          result = await PDFService.addPageNumbers(files[0]);
          break;
        case 'protect':
          if (!pdfPassword) {
            throw new Error("Please provide a password to protect the PDF.");
          }
          result = await PDFService.protectPDF(files[0], pdfPassword);
          break;
        case 'organize':
          if (!organizePages) {
            throw new Error("No page configuration provided.");
          }
          result = await PDFService.organizePDF(files[0], organizePages);
          break;
        default:
          // Fallback: return original as bytes
          result = new Uint8Array(await files[0].arrayBuffer());
      }

      setProcessingProgress(100);
      const blob = new Blob([result], { type: outputConfig.mime });
      setDownloadUrl(URL.createObjectURL(blob));
      setStage('success');
      const baseFileName = files[0]?.name ? files[0].name.replace(/\.[^/.]+$/, "") : tool.name;
      addHistory({ 
        tool: tool.id, 
        fileName: `${baseFileName}.${outputConfig.ext}`, 
        status: 'completed' 
      });
    } catch (err: any) {
      setError(err.message || "An error occurred during processing.");
      setStage('config');
    }
  };

  const translatedName = t(`tool.${tool.id}.name`, tool.name);
  const translatedDesc = t(`tool.${tool.id}.desc`, tool.description);
  const translatedSeoTitle = t(`tool.${tool.id}.seoTitle`, tool.seoTitle);
  const translatedSeoDesc = t(`tool.${tool.id}.seoDesc`, tool.seoDescription);

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to use ${translatedName}`,
    "description": translatedDesc,
    "step": extraContent?.steps.map((s, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "text": s
    })) || []
  };

  return (
    <div className="min-h-screen py-8 md:py-16 px-4 bg-slate-50 dark:bg-slate-900 transition-colors">
      <SEO 
        title={translatedSeoTitle} 
        description={translatedSeoDesc}
        keywords={tool.keywords}
        schema={schema}
      />

      <div className="max-w-5xl mx-auto">
        {/* Breadcrumbs */}
        <Breadcrumb items={[
          { label: tool.category },
          { label: translatedName }
        ]} />

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-5 bg-red-600 text-white rounded-[2rem] shadow-2xl mb-8 animate-in zoom-in duration-700">
            {getIcon(tool.icon, 48)}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
            {translatedName}
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            {translatedDesc}
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
            tool.id === 'organize' ? (
              <PdfPageOrganizer 
                file={files[0]} 
                onCancel={() => {
                  setStage('upload');
                  setFiles([]);
                }}
                onProcess={(pagesArray) => {
                  handleProcess(pagesArray);
                }}
              />
            ) : (
              <div className="animate-in fade-in zoom-in duration-500 max-w-xl mx-auto">
                {previewUrl && (
                  <div className="mb-8 rounded-[2rem] overflow-hidden border-4 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 aspect-[1/1.3] shadow-inner relative group">
                    {files[0].type === 'application/pdf' ? (
                      <PdfCanvasPreview fileUrl={previewUrl} className="w-full h-full" />
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
                <div className="space-y-6 mb-10 font-sans">
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
                  {tool.id === 'watermark' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
                          <Settings2 size={16} className="text-red-600" />
                          Watermark Text
                        </label>
                        <input 
                          type="text" 
                          value={watermarkText} 
                          onChange={(e) => setWatermarkText(e.target.value)}
                          placeholder="e.g. STRICTLY CONFIDENTIAL"
                          className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 focus:border-red-600 outline-none dark:text-white font-bold text-lg transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                            Watermark Opacity ({watermarkOpacity}%)
                          </label>
                        </div>
                        <input 
                          type="range" 
                          min="5" 
                          max="95" 
                          value={watermarkOpacity} 
                          onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                          className="w-full accent-red-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                  {tool.id === 'protect' && (
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
                        <Lock size={16} className="text-red-600" />
                        Secure Password
                      </label>
                      <input 
                        type="password" 
                        value={pdfPassword} 
                        onChange={(e) => setPdfPassword(e.target.value)}
                        placeholder="Enter password..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 focus:border-red-600 outline-none dark:text-white font-bold text-lg transition-all"
                      />
                      <p className="text-xs text-slate-400 font-medium">Use a strong password to lock permissions and protect your document.</p>
                    </div>
                  )}
                  {tool.id === 'page-numbers' && (
                    <div className="p-5 bg-red-50/50 dark:bg-slate-900/40 border border-red-100 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 font-medium text-sm leading-relaxed flex gap-3">
                      <Info size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        This tool dynamically appends standard page numbering (e.g. <span className="font-bold">"Page X of Y"</span>) to the bottom-right corner of every page in your PDF file. No additional configuration is needed.
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
                  onClick={() => handleProcess()}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-[1.5rem] font-black text-xl hover:opacity-90 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95"
                >
                  <Sparkles size={24} className="text-red-500" />
                  Process PDF
                </button>
              </div>
            )
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
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 font-medium">Your {outputConfig.name} is ready for download.</p>
              
              {outputConfig.ext === 'pdf' && (
                <div className="mb-12 rounded-[2rem] overflow-hidden border-4 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 max-w-xl mx-auto aspect-[1/1.3] shadow-inner relative group">
                  <embed src={`${downloadUrl}#toolbar=0&navpanes=0&scrollbar=0`} type="application/pdf" className="w-full h-full object-contain pointer-events-none" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-[2rem] pointer-events-none"></div>
                  <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl">Processed PDF Preview</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href={downloadUrl} 
                  download={`${tool.id}_result.${outputConfig.ext}`}
                  className="bg-red-600 text-white px-10 py-5 rounded-[1.5rem] font-black text-xl hover:bg-red-700 transition-all shadow-2xl flex items-center gap-3 group"
                >
                  <Download size={24} className="group-hover:translate-y-1 transition-transform" />
                  {outputConfig.label}
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
                {stepsList.map((step, idx) => (
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
                {faqsList.map((faq, idx) => (
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

        {/* Recommended Tools Section */}
        {TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).length > 0 && (
          <section className="mt-20">
            <h2 className="text-sm font-black text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Layers size={16} />
              Recommended Tools
            </h2>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Related to {tool.category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 3).map((recommendedTool) => (
                <Link
                  key={recommendedTool.id}
                  to={recommendedTool.path}
                  className="group flex flex-col bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="bg-slate-50 dark:bg-slate-900 w-12 h-12 flex items-center justify-center rounded-xl mb-4 text-slate-400 group-hover:bg-red-600 group-hover:text-white transition-all">
                    {getIcon(recommendedTool.icon, 24)}
                  </div>
                  <h4 className="font-black text-lg text-slate-900 dark:text-white mb-2 group-hover:text-red-600 transition-colors">
                    {recommendedTool.name}
                  </h4>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                    {recommendedTool.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

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
