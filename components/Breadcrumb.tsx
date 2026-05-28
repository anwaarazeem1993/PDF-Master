import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav 
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 px-2 overflow-x-auto whitespace-nowrap scrollbar-hide ${className}`}
    >
      <Link to="/" className="hover:text-red-600 transition-colors">Home</Link>
      {items.length > 0 && <ChevronRight size={10} />}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {isLast ? (
              <span className="text-red-600" aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            ) : item.path ? (
              <Link to={item.path} className="hover:text-red-600 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="opacity-50">{item.label}</span>
            )}
            {!isLast && <ChevronRight size={10} />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
