# 🛠 PDF Master - Internal API Documentation

The core of this SaaS is the `PDFService`, which leverages `pdf-lib` to perform high-speed document manipulation.

## Core Module: `PDFService`

### `mergePDFs(files: File[]): Promise<Uint8Array>`
- **Description**: Combines multiple PDF buffers into a single linear document.
- **Input**: Array of Browser `File` objects.
- **Output**: Serialized PDF bytes.

### `compressPDF(file: File): Promise<Uint8Array>`
- **Description**: Re-serializes the PDF using `useObjectStreams` to minimize footprint.
- **Optimization**: Strips unused metadata and compacts cross-reference tables.

### `protectPDF(file: File, password: string): Promise<Uint8Array>`
- **Description**: Encrypts the PDF.
- **Security**: Current implementation uses standard PDF 1.7 encryption.

---

## Frontend Routes (SEO Friendly)
- `/merge-pdf` -> Merge multiple files.
- `/split-pdf` -> Page extraction.
- `/compress-pdf` -> Size reduction.
- `/pdf-to-word` -> Conversion module.
- `/admin` -> Portal management.
