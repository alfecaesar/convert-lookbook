const STOREFRONT_API_URL = 'https://convert-lookbook-hzpxnwrt.myshopify.com/api/2026-07/graphql.json';
const STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_STOREFRONT_API_TOKEN;

export async function storefrontQuery(query, variables = {}) {
  if (!STOREFRONT_ACCESS_TOKEN) {
    throw new Error('Storefront API token is not configured.');
  }

  const response = await fetch(STOREFRONT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Storefront API request failed: ${response.status}`);
  }

  if (result.errors?.length) {
    console.error('Storefront API errors:', result.errors);

    throw new Error(
      result.errors[0]?.message || 'Storefront API error'
    );
  }

  return result.data;
}