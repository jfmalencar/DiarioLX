import { createRoot } from 'react-dom/client';
import { App } from './src/app/App.tsx';

const root = createRoot(document.getElementById('container')!);

root.render(<App />);