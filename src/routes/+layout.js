// @ts-nocheck
import { pageConfigs, siteConfig } from '$config/seo';
import { waitLocale } from 'svelte-i18n';

export const prerender = true;

export async function load({ url }) {
  await waitLocale();
  const pathname = url.pathname;
  
  // Determine which page config to use
  let pageKey = 'home';
  if (pathname.startsWith('/platforms')) pageKey = 'platforms';
  else if (pathname.includes('community')) pageKey = 'community';
  else if (pathname.includes('consulting')) pageKey = 'consulting';
  else if (pathname.includes('contact')) pageKey = 'contact';
  
  const pageConfig = pageConfigs[pageKey];
  
  return {
    meta: {
      title: pageConfig.title,
      description: pageConfig.description,
      url: `${siteConfig.url}${pageConfig.path}`,
      keywords: siteConfig.keywords
    }
  };
}
