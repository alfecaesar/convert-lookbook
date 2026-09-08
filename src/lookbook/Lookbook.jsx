import React, { useEffect, useState } from 'react';

import LookbookCard from './LookbookCard';
import { getLookbook } from '../api/metaobjects';

import './lookbook.css';

function Lookbook({
  lookbookHandle,
  heading,
  description,
  productsPerRow,
  showPrice,
  showCompareAtPrice,
  colorScheme,
  country,
}) {
  console.log('LOOKBOOK COMPONENT PROPS:', {
    lookbookHandle,
    country,
    heading,
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

  return (
    <section className={`lookbook lookbook--${colorScheme}`}>
      <div className="lookbook__container">
        {(heading || description) && (
          <div className="lookbook__header">
            {heading && (
              <h2 className="lookbook__heading">
                {heading}
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