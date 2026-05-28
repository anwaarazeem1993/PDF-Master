
import React, { useState, useRef, useEffect } from 'react';
import { Upload, File, X, Loader2, CheckCircle2, AlertCircle, Trash2, FileType } from 'lucide-react';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSizeMB?: number;
}

interface FileWithProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  id: string;
}

const Dropzone: React.FC<DropzoneProps> = ({ 
  onFilesSelected, 
  multiple = true, 
  accept = ".pdf",
  maxSizeMB = 500
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [filesWithProgress, setFilesWithProgress] = useState<FileWithProgress[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper to get descriptive text for accepted files
  const getAcceptedText = () => {
    if (accept.includes('.pdf') && accept.includes('.jpg')) return "PDFs and Images";
    if (accept.includes('.pdf')) return "PDF documents only";
    if (accept.includes('.jpg') || accept.includes('.png')) return "JPG, PNG or TIFF images";
    return accept.replace(/\./g, '').toUpperCase() + " files";
  };

  const simulateUpload = (file: File, id: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFilesWithProgress(prev => 
          prev.map(f => f.id === id ? { ...f, progress: 100, status: 'completed' } : f)
        );
      } else {
        setFilesWithProgress(prev => 
          prev.map(f => f.id === id ? { ...f, progress } : f)
        );
      }
    }, 150);
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const sizeMB = file.size / (1024 * 1024);
      return sizeMB <= maxSizeMB;
    });

    if (validFiles.length < newFiles.length) {
      alert(`Some files were skipped because they exceed the ${maxSizeMB}MB limit.`);
    }

    const processedFiles: FileWithProgress[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading',
      id: Math.random().toString(36).substr(2, 9)
    }));

    const updatedList = multiple ? [...filesWithProgress, ...processedFiles] : processedFiles;
    setFilesWithProgress(updatedList);

    // Start simulation for new files
    processedFiles.forEach(f => simulateUpload(f.file, f.id));
  };

  // Notify parent only when all current files are "completed"
  useEffect(() => {
    const allCompleted = filesWithProgress.length > 0 && filesWithProgress.every(f => f.status === 'completed');
    if (allCompleted) {
      onFilesSelected(filesWithProgress.map(f => f.file));
    }
  }, [filesWithProgress]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (id: string) => {
    const updated = filesWithProgress.filter(f => f.id !== id);
    setFilesWithProgress(updated);
    if (updated.length === 0) {
      onFilesSelected([]);
    }
  };

  const clearAll = () => {
    setFilesWithProgress([]);
    onFilesSelected([]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div 
        className={`relative p-10 md:p-16 border-4 border-dashed rounded-[2.5rem] transition-all duration-300 flex flex-col items-center justify-center text-center group ${
          dragActive 
          ? "border-red-500 bg-red-50/50 dark:bg-red-900/10 scale-[1.02] rotate-1" 
          : "border-slate-200 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-900/50 bg-white dark:bg-slate-800/40"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
        />
        
        <div className={`mb-6 p-6 rounded-3xl transition-all duration-500 ${dragActive ? 'bg-red-600 text-white scale-110' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:text-red-600 group-hover:bg-red-50 dark:group-hover:bg-red-900/20'}`}>
          <Upload size={48} strokeWidth={2.5} className={dragActive ? 'animate-bounce' : ''} />
        </div>
        
        <h3 className="text-2xl md:text-3xl font-black mb-3 dark:text-white tracking-tight">
          {multiple ? "Drop your files here" : "Drop your PDF here"}
        </h3>
        
        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium max-w-xs mx-auto">
          We support <span className="text-red-600 font-bold">{getAcceptedText()}</span> up to {maxSizeMB}MB.
        </p>

        <button 
          onClick={() => inputRef.current?.click()}
          className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <FileType size={20} />
          Browse Files
        </button>

        {dragActive && (
          <div className="absolute inset-0 bg-red-600/5 backdrop-blur-[2px] rounded-[2rem] pointer-events-none flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-full shadow-2xl font-black text-red-600 animate-pulse">
              Release to upload
            </div>
          </div>
        )}
      </div>

      {filesWithProgress.length > 0 && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6 px-2">
            <h4 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
              Queue
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-lg text-xs">
                {filesWithProgress.length}
              </span>
            </h4>
            <button 
              onClick={clearAll}
              className="text-xs font-black text-slate-400 hover:text-red-600 uppercase tracking-widest flex items-center gap-1 transition-colors"
            >
              <Trash2 size={14} />
              Clear All
            </button>
          </div>
          
          <div className="space-y-3">
            {filesWithProgress.map((item) => (
              <div 
                key={item.id} 
                className={`relative group flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-[1.5rem] border transition-all ${
                  item.status === 'completed' 
                  ? 'border-slate-100 dark:border-slate-700 shadow-sm' 
                  : 'border-red-100 dark:border-red-900/30 bg-red-50/10'
                }`}
              >
                {/* Progress Background */}
                {item.status === 'uploading' && (
                  <div 
                    className="absolute inset-y-0 left-0 bg-red-600/5 transition-all duration-300 rounded-l-[1.5rem]"
                    style={{ width: `${item.progress}%` }}
                  />
                )}

                <div className="flex items-center gap-4 relative z-10">
                  <div className={`p-3 rounded-xl shadow-sm ${item.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {item.status === 'completed' ? <CheckCircle2 size={24} /> : <File size={24} />}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-md">
                      {item.file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                      {item.status === 'uploading' && (
                        <span className="text-[10px] font-bold text-red-600 animate-pulse uppercase">
                          • Uploading {Math.round(item.progress)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                  {item.status === 'uploading' ? (
                    <Loader2 size={18} className="animate-spin text-red-600" />
                  ) : (
                    <button 
                      onClick={() => removeFile(item.id)}
                      className="p-2.5 bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Remove file"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropzone;
