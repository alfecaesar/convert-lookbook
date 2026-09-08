import React from 'react';
import { createRoot } from 'react-dom/client';

import Lookbook from './features/lookbook/Lookbook';
import ProductLookbook from './features/lookbook/ProductLookbook';

const components = {
  lookbook: Lookbook,
  'product-lookbook': ProductLookbook,
};

function getProps(element) {
  return {
    sectionId: element.dataset.sectionId || '',
    lookbookHandle: element.dataset.lookbookHandle || '',
    productId: element.dataset.productId || '',
    heading: element.dataset.heading || '',
    description: element.dataset.description || '',
    productsPerRow: Number(element.dataset.productsPerRow || 4),
    showPrice: element.dataset.showPrice === 'true',
    showCompareAtPrice: element.dataset.showCompareAtPrice === 'true',
    colorScheme: element.dataset.colorScheme || 'scheme-1',
    country: element.dataset.country || 'AU',
  };
}

function mountComponent(element) {
  if (element.dataset.reactMounted === 'true') {
    return;
  }

  const componentName = element.dataset.reactComponent;
  const Component = components[componentName];

  if (!Component) {
    console.warn(`Unknown React component: ${componentName}`);
    return;
  }

  const props = getProps(element);

  console.log(`Mounting React component: ${componentName}`, props);

  const root = createRoot(element);

  root.render(<Component {...props} />);

  element._reactRoot = root;
  element.dataset.reactMounted = 'true';
}

function unmountComponent(element) {
  if (!element._reactRoot) {
    return;
  }

  element._reactRoot.unmount();

  delete element._reactRoot;
  delete element.dataset.reactMounted;
}

function mountComponents(root = document) {
  root
    .querySelectorAll('[data-react-component]')
    .forEach(mountComponent);
}

mountComponents();

document.addEventListener('shopify:section:load', (event) => {
  mountComponents(event.target);
});

document.addEventListener('shopify:section:unload', (event) => {
  event.target
    .querySelectorAll('[data-react-component]')
    .forEach(unmountComponent);
});