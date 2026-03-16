import { createRoot } from 'react-dom/client';
import { App } from './src/app/App.tsx';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const root = createRoot(document.getElementById('container')!);

root.render(<App />);
