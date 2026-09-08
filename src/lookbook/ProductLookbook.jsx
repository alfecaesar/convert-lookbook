import React, { useEffect, useState } from 'react';

import LookbookCard from './LookbookCard';
import { getProductLookbooks } from '../api/metaobjects';

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
          return `<a href="${node.url || '#'}">${children}</a>`;

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

function ProductLookbook({
  productId,
  productsPerRow,
  showPrice,
  showCompareAtPrice,
  colorScheme,
  country,
}) {
  const [lookbooks, setLookbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    async function loadLookbooks() {
      try {
        setLoading(true);
        setError(null);

        const data = await getProductLookbooks(
          productId,
          country
        );

        console.log('PRODUCT LOOKBOOKS:', data);

        setLookbooks(data);
      } catch (error) {
        console.error('Failed to load product Lookbooks:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    loadLookbooks();
  }, [productId, country]);

  if (loading) {
    return null;
  }

  if (error) {
    console.error('Product Lookbook error:', error);
    return null;
  }

  if (!lookbooks.length) {
    return null;
  }

  return (
    <div className="product-lookbooks">
      {lookbooks.map((lookbook) => {
        const products = lookbook.products?.references?.nodes || [];
        const title = lookbook.title?.value || lookbook.handle;
        const description = richTextToHtml(
          lookbook.description?.value
        );

        return (
          <section
            key={lookbook.id}
            className={`lookbook lookbook--${colorScheme}`}
          >
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
      })}
    </div>
  );
}

export default ProductLookbook;