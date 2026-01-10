
import React, { useEffect } from 'react';
import { DEFAULT_SEO } from '../constants';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  type?: 'website' | 'article' | 'software';
  schema?: any;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords, 
  canonical, 
  type = 'website',
  schema 
}) => {
  useEffect(() => {
    // Update Title
    const finalTitle = title ? `${title} | PDF Master` : DEFAULT_SEO.title;
    document.title = finalTitle;

    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description || DEFAULT_SEO.description);
    }

    // Update Meta Keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      const kws = keywords ? keywords.join(', ') : DEFAULT_SEO.keywords;
      metaKeywords.setAttribute('content', kws);
    }

    // Update OG Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', finalTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description || DEFAULT_SEO.description);

    // Schema Injection
    if (schema) {
      const existingScript = document.getElementById('json-ld-schema');
      if (existingScript) existingScript.remove();

      const script = document.createElement('script');
      script.id = 'json-ld-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [title, description, keywords, schema]);

  return null;
};

export default SEO;
