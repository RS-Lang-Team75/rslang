import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { StrictMode } from 'react';

import { App } from '@/App';

import '@/styles/index.pcss';
import '@/styles/main.pcss';

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>,
);
