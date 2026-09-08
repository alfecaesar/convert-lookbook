import React from 'react';
import { createRoot } from 'react-dom/client';

import Lookbook from './lookbook/Lookbook';
import ProductLookbook from './lookbook/ProductLookbook';

const COMPONENT_REGISTRY = {
  'lookbook': Lookbook,
  'product-lookbook': ProductLookbook,
};

function getProps(element) {
  const { dataset } = element;
  
  return {
    sectionId: dataset.sectionId || '',
    lookbookHandle: dataset.lookbookHandle || '',
    productId: dataset.productId || '',
    heading: dataset.heading || '',
    description: dataset.description || '',
    productsPerRow: parseInt(dataset.productsPerRow, 10) || 4,
    showPrice: dataset.showPrice === 'true',
    showCompareAtPrice: dataset.showCompareAtPrice === 'true',
    colorScheme: dataset.colorScheme || 'scheme-1',
    country: dataset.country || 'AU',
  };
}

// mounts a react component 
function mountComponent(element) {
  if (element.dataset.reactMounted === 'true') {
    return;
  }

  const componentName = element.dataset.reactComponent;
  const Component = COMPONENT_REGISTRY[componentName];

  if (!Component) {
    console.warn(`[ReactMount] Component "${componentName}" not found in registry.`);
    return;
  }

  try {
    const props = getProps(element);
    const root = createRoot(element);
  
    element._reactRoot = root;
    root.render(<Component {...props} />);
    element.dataset.reactMounted = 'true';
  } catch (error) {
    console.error(`[ReactMount] Failed to mount ${componentName}:`, error);
  }
}

function unmountComponent(element) {
  if (element._reactRoot) {
    element._reactRoot.unmount();
    delete element._reactRoot;
    delete element.dataset.reactMounted;
  }
}

// scans for component
function mountComponents(root = document) {
  const elements = root.querySelectorAll('[data-react-component]');
  elements.forEach(mountComponent);
}

// initial mount
document.addEventListener('DOMContentLoaded', () => mountComponents());

// shopify theme editor support
document.addEventListener('shopify:section:load', (event) => {
  mountComponents(event.target);
});

document.addEventListener('shopify:section:unload', (event) => {
  event.target
    .querySelectorAll('[data-react-component]')
    .forEach(unmountComponent);
});