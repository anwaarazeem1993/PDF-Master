import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker explicitly by pointing to the cdnjs URL
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface PdfCanvasPreviewProps {
  fileUrl: string;
  className?: string;
}

const PdfCanvasPreview: React.FC<PdfCanvasPreviewProps> = ({ fileUrl, className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const renderPage = async () => {
      if (!fileUrl) return;
      try {
        setLoading(true);
        setError(null);
        
        const loadingTask = pdfjsLib.getDocument(fileUrl);
        const pdf = await loadingTask.promise;
        if (!active) return;
        
        const page = await pdf.getPage(1);
        if (!active) return;
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Scale to a decent resolution
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };
        
        await page.render(renderContext).promise;
        if (!active) return;
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error rendering PDF:', err);
        if (active) {
          setError(err.message || 'Failed to generate preview');
          setLoading(false);
        }
      }
    };

    renderPage();

    return () => {
      active = false;
    };
  }, [fileUrl]);

  return (
    <div className={`relative flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${className}`}>
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-red-200 border-t-red-600 animate-spin"></div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-500 font-bold p-4 text-center">
          {error}
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        className={`w-full h-full object-contain ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
    </div>
  );
};

export default PdfCanvasPreview;
