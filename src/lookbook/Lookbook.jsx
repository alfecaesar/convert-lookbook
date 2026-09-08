import React, { useEffect, useState } from 'react';

import LookbookCard from './LookbookCard';
import { getLookbook } from '../api/metaobjects';

import './lookbook.css';

function richTextToHtml(value) {
  if (!value) return '';

  try {
    const document = typeof value === 'string'
      ? JSON.parse(value)
      : value;

    function renderNode(node) {
      if (!node) return '';

      if (node.type === 'text') {
        return node.value || '';
      }

      const children = node.children?.map(renderNode).join('') || '';

      switch (node.type) {
        case 'root':
          return children;

        case 'paragraph':
          return `<p>${children}</p>`;

        case 'heading':
          return `<h${node.level || 2}>${children}</h${node.level || 2}>`;

        case 'bold':
          return `<strong>${children}</strong>`;

        case 'italic':
          return `<em>${children}</em>`;

        case 'link':
          return `<a href = "${node.url || '#'}">${children}</a>`;

        case 'list':
          return `<ul>${children}</ul>`;

        case 'list-item':
          return `<li>${children}</li>`;

        case 'blockquote':
          return `<blockquote>${children}</blockquote>`;

        case 'line_break':
          return '<br>';

        default:
          return children;
      }
    }

    return renderNode(document);
  } catch (error) {
    console.error('Failed to parse rich text:', error);
    return '';
  }
}

function Lookbook({
  lookbookHandle,
  productsPerRow,
  showPrice,
  showCompareAtPrice,
  colorScheme,
  country,
}) {
  console.log('LOOKBOOK COMPONENT PROPS:', {
    lookbookHandle,
    country,
  });

  const [lookbook, setLookbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('LOOKBOOK USE EFFECT:', {
      lookbookHandle,
      country,
    });

    if (!lookbookHandle) {
      console.warn('LOOKBOOK HANDLE IS EMPTY');
      setLoading(false);
      return;
    }

    async function loadLookbook() {
      try {
        console.log('CALLING getLookbook:', {
          handle: lookbookHandle,
          country,
        });

        setLoading(true);
        setError(null);

        const data = await getLookbook(
          lookbookHandle,
          country
        );

        console.log('LOOKBOOK API RESPONSE:', data);

        setLookbook(data);
      } catch (error) {
        console.error('LOOKBOOK API ERROR:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    loadLookbook();
  }, [lookbookHandle, country]);

  if (loading) {
    return (
      <section className="lookbook">
        <div className="lookbook__container">
          Loading lookbook...
        </div>
      </section>
    );
  }

  if (error || !lookbook) {
    return (
      <section className="lookbook">
        <div className="lookbook__container">
          Unable to load this lookbook.
        </div>
      </section>
    );
  }

  const products = lookbook.products?.references?.nodes || [];
  const title = lookbook.title?.value || '';
  const description = richTextToHtml(
    lookbook.description?.value
  );

  return (
    <section className={`lookbook lookbook--${colorScheme}`}>
      <div className="lookbook__container">
        {(title || description) && (
          <div className="lookbook__header">
            {title && (
              <h2 className="lookbook__heading">
                {title}
              </h2>
            )}

            {description && (
              <div
                className="lookbook__description"
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              />
            )}
          </div>
        )}

        <div
          className="lookbook__grid"
          style={{
            '--lookbook-columns': productsPerRow,
          }}
        >
          {products.map((product) => (
            <LookbookCard
              key={product.id}
              product={product}
              showPrice={showPrice}
              showCompareAtPrice={showCompareAtPrice}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Lookbook;