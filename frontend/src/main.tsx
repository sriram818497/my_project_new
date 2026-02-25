import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

document.addEventListener('pointerdown', (event) => {
  const target = (event.target as HTMLElement | null)?.closest(
    'button, input[type="button"], input[type="submit"], input[type="reset"], [role="button"], .fx-btn, a[class*="rounded"][class*="px-"][class*="py-"]'
  ) as HTMLElement | null;
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  target.style.setProperty('--ripple-x', `${x}%`);
  target.style.setProperty('--ripple-y', `${y}%`);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
