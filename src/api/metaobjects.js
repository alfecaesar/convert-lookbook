import { storefrontQuery } from './client';

const LOOKBOOK_QUERY = `
  query LookbookByHandle(
    $handle: String!
    $country: CountryCode
  ) @inContext(country: $country) {
    metaobject(
      handle: {
        type: "lookbook"
        handle: $handle
      }
    ) {
      id
      handle
      type

      title: field(key: "title") {
        value
      }

      description: field(key: "description") {
        value
      }

      image: field(key: "image") {
        reference {
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
        }
      }

      products: field(key: "products") {
        references(first: 50) {
          nodes {
            ... on Product {
              id
              handle
              title
              onlineStoreUrl

              featuredImage {
                url
                altText
                width
                height
              }

              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }

              compareAtPriceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getLookbook(handle, country) {
  const data = await storefrontQuery(LOOKBOOK_QUERY, {
    handle,
    country,
  });

  console.log('Lookbook API response:', data);

  return data.metaobject;
}

const LOOKBOOKS_QUERY = `
  query Lookbooks(
    $country: CountryCode
  ) @inContext(country: $country) {
    metaobjects(
      type: "lookbook"
      first: 50
    ) {
      nodes {
        id
        handle

        title: field(key: "title") {
          value
        }

        description: field(key: "description") {
          value
        }

        image: field(key: "image") {
          reference {
            ... on MediaImage {
              image {
                url
                altText
                width
                height
              }
            }
          }
        }

        products: field(key: "products") {
          references(first: 50) {
            nodes {
              ... on Product {
                id
                handle
                title
                onlineStoreUrl

                featuredImage {
                  url
                  altText
                  width
                  height
                }

                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }

                compareAtPriceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getProductLookbooks(productId, country) {
  const data = await storefrontQuery(LOOKBOOKS_QUERY, {
    country,
  });

  const lookbooks = data.metaobjects?.nodes || [];

  const productGid = productId.startsWith('gid://')
    ? productId
    : `gid://shopify/Product/${productId}`;

  // console.log('Current product GID:', productGid);
  console.log('Available lookbooks:', lookbooks.length);

  const matchingLookbooks = lookbooks.filter((lookbook) => {
    const products = lookbook.products?.references?.nodes || [];

    return products.some((product) => product.id === productGid);
  });

  return matchingLookbooks.slice(0, 2);
}