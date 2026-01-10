
export enum ToolCategory {
  ORGANIZE = 'Organize PDF',
  OPTIMIZE = 'Optimize PDF',
  CONVERT_FROM = 'Convert from PDF',
  CONVERT_TO = 'Convert to PDF',
  EDIT = 'Edit PDF',
  SECURITY = 'Security',
}

export interface PDFTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  path: string;
  enabled: boolean;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  history: FileHistory[];
}

export interface FileHistory {
  id: string;
  tool: string;
  fileName: string;
  timestamp: number;
  status: 'completed' | 'failed' | 'processing';
}

export interface AdminSettings {
  adsEnabled: boolean;
  siteName: string;
  metaDescription: string;
  analyticsId: string;
  topAdHtml: string;
  bottomAdHtml: string;
}
