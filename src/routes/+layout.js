// @ts-nocheck
import { pageConfigs, siteConfig } from '$config/seo';
import { waitLocale } from 'svelte-i18n';

export const prerender = true;

export async function load({ url }) {
  await waitLocale();
  const pathname = url.pathname;
  
  // Determine which page config to use
  let pageKey = 'home';
  if (pathname.startsWith('/products')) pageKey = 'products';
  else if (pathname.includes('consulting')) pageKey = 'consulting';
  else if (pathname.includes('education')) pageKey = 'education';
  else if (pathname.includes('about')) pageKey = 'about';
  else if (pathname.includes('resources')) pageKey = 'resources';
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

