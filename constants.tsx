
import React from 'react';
import { 
  Combine, Scissors, Zap, FileText, Presentation, FileSpreadsheet, 
  Image as ImageIcon, PenTool, Stamp, RotateCcw, Globe, Unlock, 
  Lock, Layout, RefreshCw, Hash, Camera, Search, FileSearch, 
  EyeOff, Crop, Workflow, FileType
} from 'lucide-react';
import { PDFTool, ToolCategory } from './types';

export interface ToolSEOContent {
  steps: string[];
  faqs: { q: string; a: string }[];
}

export const TOOL_CONTENT: Record<string, ToolSEOContent> = {
  'merge': {
    steps: [
      'Upload your PDF files by clicking the "Browse Files" button or dragging them into the dropzone.',
      'Arrange the files in the desired order by dragging them in the queue.',
      'Click "Process PDF" to combine all documents into a single file.',
      'Download your merged PDF immediately.'
    ],
    faqs: [
      { q: "Is there a limit to how many PDFs I can merge?", a: "PDF Master allows you to merge up to 20 files at once for free." },
      { q: "Will my files be stored on your server?", a: "No. Processing happens entirely in your browser. Your privacy is our priority." }
    ]
  },
  'split': {
    steps: [
      'Choose the PDF file you want to split.',
      'Enter the page range you wish to extract (e.g., 1-5, 8, 10-12).',
      'Click "Process PDF" to generate your new document.',
      'Save the extracted pages to your device.'
    ],
    faqs: [
      { q: "Can I extract non-sequential pages?", a: "Yes, you can use commas to specify individual pages like '1, 3, 5'." },
      { q: "Does splitting a PDF reduce its quality?", a: "No, the internal data is preserved perfectly during extraction." }
    ]
  },
  'compress': {
    steps: [
      'Select the PDF file you wish to optimize.',
      'Our engine will analyze and re-serialize the document for a smaller footprint.',
      'Review the status and click "Download" to save your space-saving PDF.'
    ],
    faqs: [
      { q: "Does compression reduce image quality?", a: "Our smart compression algorithm prioritizes text clarity while optimizing image data to reduce size without noticeable loss." },
      { q: "How much space can I save?", a: "On average, PDFs are reduced by 40-70% depending on original formatting." }
    ]
  },
  'pdf-to-word': {
    steps: [
      'Upload the PDF document you want to convert.',
      'Our AI-powered engine identifies text blocks and formatting.',
      'Wait for the conversion to finish and download your editable .docx file.'
    ],
    faqs: [
      { q: "Can I convert scanned PDFs to Word?", a: "Yes, our OCR (Optical Character Recognition) tool is best for scanned documents, but our standard converter handles most layouts." }
    ]
  }
};

export const TOOLS: PDFTool[] = [
  { 
    id: 'merge', 
    name: 'Merge PDF', 
    description: 'Combine multiple PDFs into one document quickly and securely.', 
    icon: 'Combine', 
    category: ToolCategory.ORGANIZE, 
    path: '/merge-pdf', 
    enabled: true,
    seoTitle: 'Merge PDF Online - Combine PDF Files for Free',
    seoDescription: 'Join multiple PDF files into one document in seconds. No registration required. Fast, safe, and secure PDF merger.',
    keywords: ['merge pdf', 'combine pdf', 'join pdf files', 'pdf binder']
  },
  { 
    id: 'split', 
    name: 'Split PDF', 
    description: 'Extract pages from your PDF or separate each page into individual files.', 
    icon: 'Scissors', 
    category: ToolCategory.ORGANIZE, 
    path: '/split-pdf', 
    enabled: true,
    seoTitle: 'Split PDF Online - Extract Pages from PDF for Free',
    seoDescription: 'Separate PDF pages or extract a specific page range into a new PDF document. Simple and free PDF splitter.',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf', 'pdf cutter']
  },
  { 
    id: 'compress', 
    name: 'Compress PDF', 
    description: 'Reduce the file size of your PDF while optimizing for maximal quality.', 
    icon: 'Zap', 
    category: ToolCategory.OPTIMIZE, 
    path: '/compress-pdf', 
    enabled: true,
    seoTitle: 'Compress PDF Online - Reduce PDF File Size Free',
    seoDescription: 'Shrink your PDF files without losing quality. Optimize documents for email and web upload.',
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'optimize pdf']
  },
  { 
    id: 'pdf-to-word', 
    name: 'PDF to Word', 
    description: 'Convert PDF files to editable Microsoft Word documents.', 
    icon: 'FileText', 
    category: ToolCategory.CONVERT_FROM, 
    path: '/pdf-to-word', 
    enabled: true,
    seoTitle: 'Convert PDF to Word Online - Free PDF to DOCX',
    seoDescription: 'Transform PDF documents into editable Word files with high accuracy. Fast and free PDF to Word converter.',
    keywords: ['pdf to word', 'convert pdf to docx', 'pdf to editable word']
  },
  { 
    id: 'pdf-to-ppt', 
    name: 'PDF to PowerPoint', 
    description: 'Convert PDF files to editable Microsoft PowerPoint presentations.', 
    icon: 'Presentation', 
    category: ToolCategory.CONVERT_FROM, 
    path: '/pdf-to-powerpoint', 
    enabled: true,
    seoTitle: 'PDF to PowerPoint Converter - PDF to PPT Online',
    seoDescription: 'Convert your PDF documents into editable PowerPoint slides. High-quality PPTX output.',
    keywords: ['pdf to ppt', 'pdf to powerpoint', 'convert pdf to slides']
  },
  { 
    id: 'pdf-to-excel', 
    name: 'PDF to Excel', 
    description: 'Convert PDF data to Microsoft Excel spreadsheets with tables preserved.', 
    icon: 'FileSpreadsheet', 
    category: ToolCategory.CONVERT_FROM, 
    path: '/pdf-to-excel', 
    enabled: true,
    seoTitle: 'PDF to Excel Converter - Free PDF to XLS Online',
    seoDescription: 'Extract PDF data and convert it into editable Excel spreadsheets. Table structure remains intact.',
    keywords: ['pdf to excel', 'pdf to xls', 'extract tables from pdf']
  },
  { 
    id: 'jpg-to-pdf', 
    name: 'JPG to PDF', 
    description: 'Convert JPG, PNG, and TIFF images into high-quality PDF files.', 
    icon: 'ImageIcon', 
    category: ToolCategory.CONVERT_TO, 
    path: '/jpg-to-pdf', 
    enabled: true,
    seoTitle: 'JPG to PDF Converter - Images to PDF Online',
    seoDescription: 'Turn your image files into a PDF document easily. Supports JPG, PNG, and more.',
    keywords: ['jpg to pdf', 'images to pdf', 'photo to pdf']
  },
  { 
    id: 'sign', 
    name: 'Sign PDF', 
    description: 'Fill and sign documents with your digital signature online.', 
    icon: 'PenTool', 
    category: ToolCategory.EDIT, 
    path: '/sign-pdf', 
    enabled: true,
    seoTitle: 'Sign PDF Online - Free Digital Signature Tool',
    seoDescription: 'Create and add your signature to PDF documents easily. Electronic signatures for free.',
    keywords: ['sign pdf', 'e-signature', 'digital signature', 'sign documents online']
  },
  { 
    id: 'watermark', 
    name: 'Add Watermark', 
    description: 'Protect your documents with custom text or image watermarks.', 
    icon: 'Stamp', 
    category: ToolCategory.EDIT, 
    path: '/watermark-pdf', 
    enabled: true,
    seoTitle: 'Add Watermark to PDF Online - Free PDF Protection',
    seoDescription: 'Protect your work with custom text or image watermarks. Choose opacity and position.',
    keywords: ['watermark pdf', 'add text to pdf', 'pdf protection']
  },
  { 
    id: 'rotate', 
    name: 'Rotate PDF', 
    description: 'Rotate your PDF pages to the correct orientation permanently.', 
    icon: 'RotateCcw', 
    category: ToolCategory.ORGANIZE, 
    path: '/rotate-pdf', 
    enabled: true,
    seoTitle: 'Rotate PDF Online - Permanently Fix PDF Orientation',
    seoDescription: 'Flip and rotate PDF pages clockwise or counter-clockwise. Save orientation forever.',
    keywords: ['rotate pdf', 'flip pdf pages', 'pdf orientation']
  },
  { 
    id: 'html-to-pdf', 
    name: 'HTML to PDF', 
    description: 'Convert web pages or HTML code directly into a PDF document.', 
    icon: 'Globe', 
    category: ToolCategory.CONVERT_TO, 
    path: '/html-to-pdf', 
    enabled: true,
    seoTitle: 'HTML to PDF Converter - Web to PDF Online',
    seoDescription: 'Save any webpage as a PDF document. High fidelity HTML rendering.',
    keywords: ['html to pdf', 'web to pdf', 'save page as pdf']
  },
  { 
    id: 'unlock', 
    name: 'Unlock PDF', 
    description: 'Remove passwords and restrictions from your locked PDF files.', 
    icon: 'Unlock', 
    category: ToolCategory.SECURITY, 
    path: '/unlock-pdf', 
    enabled: true,
    seoTitle: 'Unlock PDF - Remove Password from PDF Online',
    seoDescription: 'Remove PDF password security and permissions to edit and print freely.',
    keywords: ['unlock pdf', 'remove pdf password', 'pdf decrypter']
  },
  { 
    id: 'protect', 
    name: 'Protect PDF', 
    description: 'Encrypt your PDF with a secure password to prevent unauthorized access.', 
    icon: 'Lock', 
    category: ToolCategory.SECURITY, 
    path: '/protect-pdf', 
    enabled: true,
    seoTitle: 'Protect PDF with Password - Free PDF Encryption',
    seoDescription: 'Encrypt your sensitive PDF files with a secure password. Keep your documents private.',
    keywords: ['protect pdf', 'password protect pdf', 'encrypt pdf']
  },
  { 
    id: 'organize', 
    name: 'Organize PDF', 
    description: 'Reorder, delete, and manage pages in your PDF document.', 
    icon: 'Layout', 
    category: ToolCategory.ORGANIZE, 
    path: '/organize-pdf', 
    enabled: true,
    seoTitle: 'Organize PDF Online - Rearrange & Delete Pages',
    seoDescription: 'Manage your PDF pages by reordering them or removing unwanted pages.',
    keywords: ['organize pdf', 'reorder pdf pages', 'delete pdf pages']
  },
  { 
    id: 'pdf-a', 
    name: 'PDF to PDF/A', 
    description: 'Convert your PDF to PDF/A for long-term archiving and ISO standards.', 
    icon: 'FileType', 
    category: ToolCategory.OPTIMIZE, 
    path: '/pdf-to-pdfa', 
    enabled: true,
    seoTitle: 'Convert PDF to PDF/A Online - Archival Format',
    seoDescription: 'Transform your PDF into the standardized archival format for long-term storage.',
    keywords: ['pdf to pdfa', 'archive pdf', 'iso pdf standard']
  },
  { 
    id: 'repair', 
    name: 'Repair PDF', 
    description: 'Recover data and fix corrupted or damaged PDF documents.', 
    icon: 'RefreshCw', 
    category: ToolCategory.OPTIMIZE, 
    path: '/repair-pdf', 
    enabled: true,
    seoTitle: 'Repair Corrupted PDF Online - Fix Damaged PDF',
    seoDescription: 'Try to recover and fix files that won\'t open or are corrupted.',
    keywords: ['repair pdf', 'fix corrupted pdf', 'recover pdf']
  },
  { 
    id: 'page-numbers', 
    name: 'Add Page Numbers', 
    description: 'Insert page numbers into your PDF at custom positions and styles.', 
    icon: 'Hash', 
    category: ToolCategory.EDIT, 
    path: '/add-page-numbers', 
    enabled: true,
    seoTitle: 'Add Page Numbers to PDF Online - Number PDF Pages',
    seoDescription: 'Easily add pagination to your documents with customizable fonts and positions.',
    keywords: ['page numbers pdf', 'number pdf pages', 'pdf pagination']
  },
  { 
    id: 'scan', 
    name: 'Scan to PDF', 
    description: 'Create a PDF directly from your device camera or mobile scan.', 
    icon: 'Camera', 
    category: ToolCategory.CONVERT_TO, 
    path: '/scan-to-pdf', 
    enabled: true,
    seoTitle: 'Scan to PDF Online - Camera Scanner to PDF',
    seoDescription: 'Use your phone or webcam to scan physical documents into high-quality PDFs.',
    keywords: ['scan to pdf', 'mobile scanner', 'camera to pdf']
  },
  { 
    id: 'ocr', 
    name: 'OCR PDF', 
    description: 'Convert scanned PDFs into searchable and selectable text files.', 
    icon: 'Search', 
    category: ToolCategory.EDIT, 
    path: '/ocr-pdf', 
    enabled: true,
    seoTitle: 'OCR PDF Online - Scanned PDF to Searchable Text',
    seoDescription: 'Extract text from scanned PDF images using advanced OCR technology.',
    keywords: ['ocr pdf', 'optical character recognition', 'scanned pdf to text']
  },
  { 
    id: 'compare', 
    name: 'Compare PDF', 
    description: 'Highlight differences and changes between two PDF documents.', 
    icon: 'FileSearch', 
    category: ToolCategory.EDIT, 
    path: '/compare-pdf', 
    enabled: true,
    seoTitle: 'Compare PDF Files Online - Find Differences',
    seoDescription: 'Upload two PDFs and see exactly what changed between the versions.',
    keywords: ['compare pdf', 'pdf diff', 'check pdf changes']
  },
  { 
    id: 'redact', 
    name: 'Redact PDF', 
    description: 'Permanently remove sensitive information from your PDF files.', 
    icon: 'EyeOff', 
    category: ToolCategory.EDIT, 
    path: '/redact-pdf', 
    enabled: true,
    seoTitle: 'Redact PDF Online - Remove Sensitive Data',
    seoDescription: 'Securely black out text and images in your PDF permanently.',
    keywords: ['redact pdf', 'black out text pdf', 'remove private data']
  },
  { 
    id: 'crop', 
    name: 'Crop PDF', 
    description: 'Trim the margins and whitespace of your PDF pages.', 
    icon: 'Crop', 
    category: ToolCategory.ORGANIZE, 
    path: '/crop-pdf', 
    enabled: true,
    seoTitle: 'Crop PDF Online - Trim PDF Margins',
    seoDescription: 'Crop PDF pages to custom dimensions or remove white borders easily.',
    keywords: ['crop pdf', 'trim pdf', 'cut pdf margins']
  },
  { 
    id: 'workflow', 
    name: 'Create Workflow', 
    description: 'Automate multi-step PDF tasks like Compress → OCR → Protect.', 
    icon: 'Workflow', 
    category: ToolCategory.ORGANIZE, 
    path: '/pdf-workflow', 
    enabled: true,
    seoTitle: 'PDF Workflow Automation - Multi-step PDF Tasks',
    seoDescription: 'Build custom automation sequences for your document management needs.',
    keywords: ['pdf workflow', 'automate pdf', 'pdf batch processing']
  }
];

export const DEFAULT_SEO = {
  title: 'PDF Master - All-in-One Online PDF Suite',
  description: 'The ultimate cloud-based suite for all your PDF needs. Merge, split, compress, convert, and protect PDF files for free. Fast, safe, and easy.',
  keywords: 'pdf tools, merge pdf, split pdf, convert pdf, compress pdf, online pdf editor'
};

export const getIcon = (iconName: string, size = 24, className = "") => {
  const IconMap: any = {
    Combine, Scissors, Zap, FileText, Presentation, FileSpreadsheet, 
    ImageIcon, PenTool, Stamp, RotateCcw, Globe, Unlock, Lock, Layout, 
    RefreshCw, Hash, Camera, Search, FileSearch, EyeOff, Crop, Workflow, FileType
  };
  const IconComponent = IconMap[iconName] || FileText;
  return <IconComponent size={size} className={className} />;
};
