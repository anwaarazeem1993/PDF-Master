
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
    const finalTitle = title ? `${title} | PDF Master` : DEFAULT_SEO.title;
    const finalDesc = description || DEFAULT_SEO.description;
    const finalKeywords = keywords ? keywords.join(', ') : DEFAULT_SEO.keywords;
    const siteUrl = "https://pdfmaster.app"; // Replace with real domain

    document.title = finalTitle;

    // Standard Meta
    const updateMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const updateProperty = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateMeta('description', finalDesc);
    updateMeta('keywords', finalKeywords);
    
    // OG Meta
    updateProperty('og:title', finalTitle);
    updateProperty('og:description', finalDesc);
    updateProperty('og:type', type);
    updateProperty('og:url', window.location.href);
    updateProperty('og:site_name', 'PDF Master');
    
    // Twitter Meta
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', finalTitle);
    updateMeta('twitter:description', finalDesc);

    // Canonical
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical || window.location.href);

    // Default App Schema
    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "PDF Master",
      "operatingSystem": "Web, Windows, macOS, Android, iOS",
      "applicationCategory": "MultimediaApplication",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1250"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };

    // Schema Injection
    const existingScript = document.getElementById('json-ld-schema');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'json-ld-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema || defaultSchema);
    document.head.appendChild(script);

  }, [title, description, keywords, schema, canonical, type]);

  return null;
};

export default SEO;
