import React from 'react';
import { createRoot } from 'react-dom/client';

function Text() {
  return (
    <div style={{ padding: '20px', background: '#eee' }}>
      React is working!
    </div>
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('[data-react-root]');

  console.log('React roots found:', elements.length);

  elements.forEach((element) => {
    createRoot(element).render(<Text />);
  });
});