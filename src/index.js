import React from 'react';
import { createRoot } from 'react-dom/client';

import Viewer from './Viewer';

const element = document.getElementById('app');

if (element) {
    createRoot(element).render(<Viewer />);
}
