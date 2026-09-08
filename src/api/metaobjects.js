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

  // const matchingLookbooks = lookbooks.filter((lookbook) => {
  //   const products = lookbook.products?.references?.nodes || [];
  //   return products.some((product) => product.id === productGid);
  // });
  
  // return matchingLookbooks.slice(0, 2);

  // instead of returning 2 ascending lookbook, this will return 2 random lookbook
  const matchingLookbooks = lookbooks.filter((lookbook) => {
    const products = lookbook.products?.references?.nodes || [];
    return products.some((product) => product.id === productGid);
  });
  const shuffledLookbooks = [...matchingLookbooks];

  for (let i = shuffledLookbooks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledLookbooks[i], shuffledLookbooks[j]] = [
      shuffledLookbooks[j],
      shuffledLookbooks[i],
    ];
  }

  return shuffledLookbooks.slice(0, 2);
}