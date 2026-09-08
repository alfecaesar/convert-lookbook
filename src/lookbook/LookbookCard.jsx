import React from 'react';

function formatPrice(price) {
  if (!price) return null;

  const currencySymbols = {
    AUD: '$',
    JPY: '¥',
  };

  const symbol = currencySymbols[price.currencyCode] || price.currencyCode;

  const amount = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: price.currencyCode === 'JPY' ? 0 : 2,
    maximumFractionDigits: price.currencyCode === 'JPY' ? 0 : 2,
  }).format(Number(price.amount));

  return `${symbol}${amount} ${price.currencyCode}`;
}

function LookbookCard({
  product,
  showPrice,
  showCompareAtPrice,
}) {
  const price = product.priceRange?.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;

  const hasCompareAtPrice =
    compareAtPrice &&
    price &&
    Number(compareAtPrice.amount) > Number(price.amount);

  return (
    <article className="lookbook-card">
      <a
        href={product.onlineStoreUrl || `/products/${product.handle}`}
        className="lookbook-card__image"
      >
        {product.featuredImage && (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            loading="lazy"
            width={product.featuredImage.width}
            height={product.featuredImage.height}
          />
        )}
      </a>

      <div className="lookbook-card__content">
        <h3 className="lookbook-card__title">
          <a
            href={product.onlineStoreUrl || `/products/${product.handle}`}
          >
            {product.title}
          </a>
        </h3>

        {showPrice && price && (
          <div className="lookbook-card__price">
            <span>{formatPrice(price)}</span>

            {showCompareAtPrice && hasCompareAtPrice && (
              <s className="lookbook-card__price-compare">
                {formatPrice(compareAtPrice)}
              </s>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default LookbookCard;