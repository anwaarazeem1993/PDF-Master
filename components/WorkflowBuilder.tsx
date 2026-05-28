import React, { useState } from 'react';
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
  horizontalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TOOLS, getIcon } from '../constants';
import { ArrowRight, Play, Plus, X } from 'lucide-react';
import { PDFTool, ToolCategory } from '../types';

const getCategoryColor = (category: ToolCategory) => {
  switch (category) {
    case ToolCategory.ORGANIZE: return 'text-blue-500';
    case ToolCategory.OPTIMIZE: return 'text-green-500';
    case ToolCategory.CONVERT_FROM: return 'text-purple-500';
    case ToolCategory.CONVERT_TO: return 'text-indigo-500';
    case ToolCategory.EDIT: return 'text-red-500';
    case ToolCategory.SECURITY: return 'text-amber-500';
    default: return 'text-slate-500';
  }
};

interface SortableToolItemProps {
  id: string;
  tool: PDFTool;
  onRemove: (id: string) => void;
  isOverlay?: boolean;
}

const SortableToolItem: React.FC<SortableToolItemProps> = ({ id, tool, onRemove, isOverlay }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isOverlay ? 999 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 ${isOverlay ? 'border-red-500 shadow-xl scale-105' : 'border-slate-200 dark:border-slate-700 shadow-sm'} w-32`}
      {...attributes}
      {...listeners}
    >
      <div className={`${getCategoryColor(tool.category)}`}>
        {getIcon(tool.icon, 32)}
      </div>
      <span className="text-xs font-bold text-center text-slate-700 dark:text-slate-300">
        {tool.name}
      </span>
      {!isOverlay && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          className="absolute -top-2 -right-2 bg-slate-900 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export const WorkflowBuilder: React.FC = () => {
  // Store items in the chain as objects with unique IDs to allow duplicates
  const [chain, setChain] = useState<{ id: string; toolId: string }[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addTool = (toolId: string) => {
    setChain([...chain, { id: `${toolId}-\${Date.now()}`, toolId }]);
  };

  const removeTool = (id: string) => {
    setChain(chain.filter(item => item.id !== id));
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setChain((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const activeTool = activeId ? TOOLS.find(t => t.id === chain.find(c => c.id === activeId)?.toolId) : null;

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black dark:text-white flex items-center gap-3">
            <Plus className="text-red-600" />
            Batch Workflow Builder
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Chain multiple tools together for automated bulk processing.</p>
        </div>
        <button 
          disabled={chain.length === 0}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 text-white px-6 py-3 rounded-full font-bold transition-all shadow-md"
        >
          <Play size={18} /> Execute Chain
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tool Palette */}
        <div className="w-full lg:w-64 bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
          <h4 className="text-sm font-black uppercase text-slate-500 tracking-widest mb-4">Available Tools</h4>
          <div className="flex flex-wrap gap-2">
            {TOOLS.filter(t => t.enabled).map(tool => (
              <button
                key={tool.id}
                onClick={() => addTool(tool.id)}
                className={`flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:border-red-500 hover:text-red-500 transition-colors flex-grow lg:w-full group`}
              >
                <div className={`${getCategoryColor(tool.category)} group-hover:text-red-500`}>
                  {getIcon(tool.icon, 16)}
                </div>
                {tool.name}
              </button>
            ))}
          </div>
        </div>

        {/* Builder Canvas */}
        <div className="flex-grow min-h-[300px] bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-x-auto">
          {chain.length === 0 ? (
            <div className="text-center text-slate-400">
              <Plus size={48} className="mx-auto mb-4 opacity-50 text-red-400" />
              <p className="text-lg font-bold">Your Workflow is Empty</p>
              <p className="text-sm">Click tools on the left to add them to your chain.</p>
            </div>
          ) : (
            <div className="w-full flex items-center justify-start min-w-max pb-4 px-4 overflow-x-auto">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={chain.map(c => c.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  <div className="flex items-center">
                    {chain.map((item, index) => {
                      const toolDef = TOOLS.find(t => t.id === item.toolId)!;
                      return (
                        <React.Fragment key={item.id}>
                          <SortableToolItem 
                            id={item.id} 
                            tool={toolDef} 
                            onRemove={removeTool} 
                          />
                          {index < chain.length - 1 && (
                            <ArrowRight size={24} className="text-slate-400 mx-4 flex-shrink-0" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </SortableContext>
                
                <DragOverlay>
                  {activeId && activeTool ? (
                    <SortableToolItem 
                      id={activeId} 
                      tool={activeTool} 
                      onRemove={() => {}}
                      isOverlay
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
