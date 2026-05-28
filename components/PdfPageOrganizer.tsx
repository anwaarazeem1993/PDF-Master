import React, { useState, useEffect, useRef } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  RotateCw, RotateCcw, Trash2, FilePlus2, Copy, Grid, 
  Sparkles, RefreshCw, Undo2, LayoutList, CheckCircle2 
} from 'lucide-react';

// Configure the worker explicitly by pointing to the cdnjs URL
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface PageItem {
  id: string;
  pageNum: number;      // -1 for blank page
  rotation: number;     // 0, 90, 180, 270
}

interface PageThumbnailRendererProps {
  pdf: any;
  pageNum: number;
  rotation: number;
}

const PageThumbnailRenderer: React.FC<PageThumbnailRendererProps> = ({ pdf, pageNum, rotation }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pageNum === -1) {
      setLoading(false);
      return;
    }

    let active = true;

    const renderPage = async () => {
      try {
        setLoading(true);
        const page = await pdf.getPage(pageNum);
        if (!active) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Render at a small scale for thumbnail performance
        const viewport = page.getViewport({ scale: 0.4 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        if (active) {
          setLoading(false);
        }
      } catch (err) {
        console.error('Thumbnail render error:', err);
        if (active) setLoading(false);
      }
    };

    renderPage();

    return () => {
      active = false;
    };
  }, [pdf, pageNum]);

  if (pageNum === -1) {
    return (
      <div className="w-full h-full bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-4">
        <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Blank Page</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
          <div className="w-6 h-6 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{ transform: `rotate(${rotation}deg)` }}
        className="max-w-full max-h-full object-contain transition-transform duration-200 shadow-sm"
      />
    </div>
  );
};

interface SortablePageItemProps {
  id: string;
  item: PageItem;
  pdf: any;
  index: number;
  onRotate: (id: string, dir: 'cw' | 'ccw') => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onInsertBlank: (id: string) => void;
  isOverlay?: boolean;
}

const SortablePageItem: React.FC<SortablePageItemProps> = ({ 
  id, item, pdf, index, onRotate, onDelete, onDuplicate, onInsertBlank, isOverlay 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isOverlay ? 999 : undefined,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-col justify-between aspect-[1/1.4] transition-all hover:shadow-md hover:border-red-500/50 ${isOverlay ? 'ring-4 ring-red-500/30 border-red-500 scale-105 shadow-xl' : ''}`}
    >
      {/* Drag handle header overlay */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute inset-x-0 top-0 h-44 cursor-grab active:cursor-grabbing rounded-t-3xl z-10"
        title="Drag to rearrange page order"
      />

      {/* Grid item Header */}
      <div className="flex items-center justify-between mb-2 relative z-20">
        <span className="text-xs font-black bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full text-slate-700 dark:text-slate-300">
          Page {index + 1}
        </span>
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
          {item.pageNum === -1 ? 'Blank' : `Source: p.${item.pageNum}`}
        </span>
      </div>

      {/* Canvas / Thumbnail Renderer */}
      <div className="flex-grow rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 flex items-center justify-center relative mb-3 aspect-[1/1.2]">
        <PageThumbnailRenderer pdf={pdf} pageNum={item.pageNum} rotation={item.rotation} />
      </div>

      {/* Control Actions footer */}
      <div className="flex items-center justify-between gap-1.5 pt-1 relative z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRotate(id, 'ccw');
          }}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl transition-all hover:text-red-600"
          title="Rotate Left (-90°)"
        >
          <RotateCcw size={15} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRotate(id, 'cw');
          }}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl transition-all hover:text-red-600"
          title="Rotate Right (+90°)"
        >
          <RotateCw size={15} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate(id);
          }}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl transition-all hover:text-red-600"
          title="Duplicate Page"
        >
          <Copy size={15} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInsertBlank(id);
          }}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl transition-all hover:text-red-600"
          title="Insert Blank Page After"
        >
          <FilePlus2 size={15} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-600 rounded-xl transition-all"
          title="Delete Page"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

interface PdfPageOrganizerProps {
  file: File;
  onCancel: () => void;
  onProcess: (pagesArray: PageItem[]) => void;
}

export const PdfPageOrganizer: React.FC<PdfPageOrganizerProps> = ({ file, onCancel, onProcess }) => {
  const [pdf, setPdf] = useState<any>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Avoid triggering drag on mere clicks
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    let active = true;

    const loadDocument = async () => {
      try {
        setLoading(true);
        setError(null);
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const loadedPdf = await loadingTask.promise;
        
        if (!active) return;
        setPdf(loadedPdf);

        const initialPages = Array.from({ length: loadedPdf.numPages }, (_, index) => ({
          id: `page-${index + 1}-${Date.now()}`,
          pageNum: index + 1,
          rotation: 0
        }));

        setPages(initialPages);
        setLoading(false);
      } catch (err: any) {
        console.error('Error loading PDF in organizer:', err);
        if (active) {
          setError(err.message || 'Could not parse this PDF file. It might be corrupted or encrypted.');
          setLoading(false);
        }
      }
    };

    loadDocument();

    return () => {
      active = false;
    };
  }, [file]);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPages((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const handleRotate = (id: string, dir: 'cw' | 'ccw') => {
    setPages(prev => prev.map(item => {
      if (item.id === id) {
        const adjustment = dir === 'cw' ? 90 : -90;
        const newRotation = (item.rotation + adjustment + 360) % 360;
        return { ...item, rotation: newRotation };
      }
      return item;
    }));
  };

  const handleDelete = (id: string) => {
    if (pages.length === 1) {
      alert('Your document must have at least one page.');
      return;
    }
    setPages(prev => prev.filter(item => item.id !== id));
  };

  const handleDuplicate = (id: string) => {
    const origIndex = pages.findIndex(item => item.id === id);
    if (origIndex === -1) return;
    const origItem = pages[origIndex];
    const newItem = {
      ...origItem,
      id: `${origItem.pageNum}-dup-${Date.now()}`
    };
    const updatedPages = [...pages];
    updatedPages.splice(origIndex + 1, 0, newItem);
    setPages(updatedPages);
  };

  const handleInsertBlank = (id: string) => {
    const origIndex = pages.findIndex(item => item.id === id);
    if (origIndex === -1) return;
    const blankItem = {
      id: `blank-${Date.now()}`,
      pageNum: -1,
      rotation: 0
    };
    const updatedPages = [...pages];
    updatedPages.splice(origIndex + 1, 0, blankItem);
    setPages(updatedPages);
  };

  const handleReset = () => {
    if (!pdf) return;
    const initialPages = Array.from({ length: pdf.numPages }, (_, index) => ({
      id: `page-${index + 1}-${Date.now()}`,
      pageNum: index + 1,
      rotation: 0
    }));
    setPages(initialPages);
  };

  const activePageItem = activeId ? pages.find(p => p.id === activeId) : null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <RefreshCw size={40} className="text-red-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold">Parsing PDF pages for interactive workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 dark:bg-red-950/20 border border-red-250 rounded-2xl">
        <p className="text-red-600 font-black mb-4">{error}</p>
        <button 
          onClick={onCancel}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Toolbar / Actions Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-600 text-white rounded-2xl">
            <Grid size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black dark:text-white uppercase tracking-wider flex items-center gap-2">
              Visual Workspace 
              <span className="text-xs bg-red-100 dark:bg-red-950/50 text-red-600 px-2 py-0.5 rounded-md font-bold text-normal normal-case">
                Foxit PDF Engine Mode
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Drag to reorder. Hover cards to rotate, duplicate, insert blank, or delete pages list.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs transition"
          >
            <Undo2 size={14} /> Reset
          </button>
          
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white text-xs font-bold transition"
          >
            Cancel
          </button>
          
          <button 
            onClick={() => onProcess(pages)}
            disabled={pages.length === 0}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-2xl text-xs font-black transition shadow-lg shadow-red-600/10"
          >
            <Sparkles size={14} /> Organize & Save
          </button>
        </div>
      </div>

      {/* Pages Workspace Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={pages.map(p => p.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {pages.map((item, index) => (
              <SortablePageItem 
                key={item.id}
                id={item.id}
                item={item}
                pdf={pdf}
                index={index}
                onRotate={handleRotate}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onInsertBlank={handleInsertBlank}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeId && activePageItem && pdf ? (
            <div className="w-[180px] h-[250px]">
              <SortablePageItem 
                id={activeId}
                item={activePageItem}
                pdf={pdf}
                index={pages.findIndex(p => p.id === activeId)}
                onRotate={() => {}}
                onDelete={() => {}}
                onDuplicate={() => {}}
                onInsertBlank={() => {}}
                isOverlay
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Footer Info Summary status */}
      <div className="text-right text-xs font-bold text-slate-400">
        Total Pages: <span className="text-slate-700 dark:text-slate-300">{pages.length}</span> (original PDF: {pdf?.numPages} pages)
      </div>
    </div>
  );
};

export default PdfPageOrganizer;
