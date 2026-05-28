import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'fr';

interface I18nContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.tools': 'PDF Tools',
    'nav.merge': 'Merge',
    'nav.compress': 'Compress',
    'nav.convert': 'Convert',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.dashboard': 'Dashboard',
    'hero.title': 'Every tool you need to work with PDFs in one place',
    'hero.subtitle': 'All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.',
    'tools.popular': 'Popular PDF Tools',
    'footer.description': 'The most advanced client-side PDF suite. Process documents privately and securely directly in your browser.',
    
    // Tools
    'tool.merge.name': 'Merge PDF',
    'tool.merge.desc': 'Combine multiple PDFs into one document quickly and securely.',
    'tool.merge.seoTitle': 'Merge PDF Files Online Free | Best PDF Combiner & Joiner Tool',
    'tool.merge.seoDesc': 'Join and combine multiple PDF files into one single document in seconds. No registration required. Fast, safe, secure, and entirely client-side PDF merger.',
    'tool.split.name': 'Split PDF',
    'tool.split.desc': 'Extract pages from your PDF or save each page as a separate PDF.',
    'tool.split.seoTitle': 'Split PDF Online | Extract PDF Pages to Separate Files Free',
    'tool.split.seoDesc': 'Separate PDF pages or extract a specific page range into a new PDF document. Simple, free, and secure client-side PDF splitter.',
    'tool.compress.name': 'Compress PDF',
    'tool.compress.desc': 'Reduce file size while optimizing for maximal PDF quality.',
    'tool.compress.seoTitle': 'Compress PDF Online | Reduce PDF File Size Without Losing Quality',
    'tool.compress.seoDesc': 'Shrink your PDF files without losing quality. Optimize documents for email and web upload with our advanced, secure PDF compressor.',
    'tool.pdf-to-word.name': 'PDF to Word',
    'tool.pdf-to-word.desc': 'Convert PDF files to editable Microsoft Word documents.',
    'tool.pdf-to-word.seoTitle': 'Convert PDF to Word Online | Free PDF to DOCX Converter',
    'tool.pdf-to-word.seoDesc': 'Transform PDF documents into editable Word files with high accuracy. Fast and free PDF to Word converter that preserves table structures and fonts.'
  },
  es: {
    'nav.tools': 'Herramientas PDF',
    'nav.merge': 'Unir',
    'nav.compress': 'Comprimir',
    'nav.convert': 'Convertir',
    'nav.login': 'Iniciar Sesión',
    'nav.signup': 'Registrarse',
    'nav.dashboard': 'Panel',
    'hero.title': 'Todas las herramientas que necesitas para trabajar con PDF en un solo lugar',
    'hero.subtitle': '¡Todas son 100% GRATIS y fáciles de usar! Une, divide, comprime, convierte, rota, desbloquea y añade marcas de agua a PDFs con solo unos pocos clics.',
    'tools.popular': 'Herramientas PDF populares',
    'footer.description': 'La suite PDF orientada al cliente más avanzada. Procesa documentos de forma privada y segura directamente en tu navegador.',
    
    // Tools
    'tool.merge.name': 'Unir PDF',
    'tool.merge.desc': 'Combina varios PDF en un solo documento de forma rápida y segura.',
    'tool.merge.seoTitle': 'Unir archivos PDF gratis en línea | La mejor herramienta para combinar',
    'tool.merge.seoDesc': 'Une y combina múltiples archivos PDF en un solo documento en segundos. Sin necesidad de registrarse. Rápido, seguro y completamente del lado del cliente.',
    'tool.split.name': 'Dividir PDF',
    'tool.split.desc': 'Extrae páginas de tu PDF o guarda cada página como un PDF separado.',
    'tool.split.seoTitle': 'Dividir PDF en línea | Extraer páginas a archivos separados gratis',
    'tool.split.seoDesc': 'Separa las páginas de un PDF o extrae un rango específico en un nuevo documento. Sencillo, gratuito y seguro divisor de PDF.',
    'tool.compress.name': 'Comprimir PDF',
    'tool.compress.desc': 'Reduce el tamaño del archivo optimizando la calidad del PDF al máximo.',
    'tool.compress.seoTitle': 'Comprimir PDF en línea | Reducir el tamaño sin perder calidad',
    'tool.compress.seoDesc': 'Reduce tus archivos PDF sin perder calidad. Optimiza documentos para correo electrónico y carga web con nuestro compresor seguro.',
    'tool.pdf-to-word.name': 'PDF a Word',
    'tool.pdf-to-word.desc': 'Convierte archivos PDF en documentos editables de Microsoft Word.',
    'tool.pdf-to-word.seoTitle': 'Convertir PDF a Word en línea | Convertidor gratuito de PDF a DOCX',
    'tool.pdf-to-word.seoDesc': 'Transforma documentos PDF en archivos Word editables con alta precisión. Rápido y gratuito conservando tablas y fuentes.'
  },
  fr: {
    'nav.tools': 'Outils PDF',
    'nav.merge': 'Fusionner',
    'nav.compress': 'Compresser',
    'nav.convert': 'Convertir',
    'nav.login': 'Se Connecter',
    'nav.signup': 'S\'inscrire',
    'nav.dashboard': 'Tableau de Bord',
    'hero.title': 'Tous les outils dont vous avez besoin pour utiliser les PDF, à portée de main',
    'hero.subtitle': 'Tous sont 100% GRATUITS et faciles à utiliser! Fusionner, diviser, compresser, convertir, faire pivoter, déverrouiller et ajouter un filigrane...',
    'tools.popular': 'Outils PDF populaires',
    'footer.description': 'La suite PDF côté client la plus avancée. Traitez les documents en privé et en toute sécurité directement dans votre navigateur.',
    
    // Tools
    'tool.merge.name': 'Fusionner PDF',
    'tool.merge.desc': 'Combinez plusieurs PDF en un seul document rapidement et en toute sécurité.',
    'tool.merge.seoTitle': 'Fusionner des fichiers PDF en ligne gratuit | Meilleur outil pour combiner',
    'tool.merge.seoDesc': 'Fusionnez et combinez plusieurs fichiers PDF en un seul document en quelques secondes. Sans inscription. Rapide et sécurisé.',
    'tool.split.name': 'Diviser PDF',
    'tool.split.desc': 'Extrayez des pages de votre PDF ou enregistrez chaque page en tant que PDF distinct.',
    'tool.split.seoTitle': 'Diviser PDF en ligne | Extraire des pages dans des fichiers séparés gratuits',
    'tool.split.seoDesc': 'Séparez les pages d\'un PDF ou extrayez une plage spécifique dans un nouveau document. Séparez vos PDF simplement.',
    'tool.compress.name': 'Compresser PDF',
    'tool.compress.desc': 'Réduisez la taille du fichier tout en optimisant la qualité maximale du PDF.',
    'tool.compress.seoTitle': 'Compresser PDF en ligne | Réduire la taille sans perdre en qualité',
    'tool.compress.seoDesc': 'Réduisez vos fichiers PDF sans perdre en qualité. Optimisez vos documents avec notre compresseur avancé.',
    'tool.pdf-to-word.name': 'PDF en Word',
    'tool.pdf-to-word.desc': 'Convertissez des fichiers PDF en documents Microsoft Word modifiables.',
    'tool.pdf-to-word.seoTitle': 'Convertir PDF en Word en ligne | Convertisseur de PDF en DOCX gratuit',
    'tool.pdf-to-word.seoDesc': 'Transformez facilement vos documents PDF en fichiers Word modifiables avec notre convertisseur rapide et gratuit.'
  }
};

const I18nContext = createContext<I18nContextProps>({
  language: 'en',
  setLanguage: () => {},
  t: (key, defaultText) => defaultText || key,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('app_language');
      if (saved && (saved === 'en' || saved === 'es' || saved === 'fr')) {
        return saved as Language;
      }
    } catch(e) {}
    return 'en'; // Default
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, defaultText?: string) => {
    const translation = translations[language]?.[key] || translations['en']?.[key];
    return translation || defaultText || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
