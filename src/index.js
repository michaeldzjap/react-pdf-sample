import React from 'react';
import { createRoot } from 'react-dom/client';
import { pdfjs } from 'react-pdf';

import Viewer from './Viewer';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

const element = document.getElementById('app');

if (element) {
    createRoot(element).render(<Viewer />);
}
