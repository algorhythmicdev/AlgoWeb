// @ts-nocheck
import { pageConfigs, siteConfig } from '$config/seo';
import { waitLocale } from 'svelte-i18n';

export const prerender = true;

const ROUTE_MAPPINGS = [
  { key: 'home', patterns: [/^\/$/] },
  { key: 'products', patterns: [/^\/products(\/?|$)/, /^\/platform(\/?|$)/, /^\/nodevoyage(\/?|$)/, /^\/ideonautix(\/?|$)/] },
  { key: 'consulting', patterns: [/^\/consulting(\/?|$)/] },
  { key: 'education', patterns: [/^\/education(\/?|$)/] },
  { key: 'educationalOutreach', patterns: [/^\/educational-outreach(\/?|$)/] },
  {
    key: 'resources',
    patterns: [/^\/education-hub(\/?|$)/, /^\/blog(\/?|$)/, /^\/help-center(\/?|$)/]
  },
  { key: 'about', patterns: [/^\/about(\/?|$)/] },
  { key: 'contact', patterns: [/^\/contact(\/?|$)/] },
  { key: 'services', patterns: [/^\/services(\/?|$)/, /^\/solutions(\/?|$)/] }
];

function resolvePageKey(pathname) {
  const normalised = pathname.replace(/\/+$/, '') || '/';
  const entry = ROUTE_MAPPINGS.find(({ patterns }) => patterns.some((pattern) => pattern.test(normalised)));
  return entry?.key ?? 'home';
}

export async function load({ url }) {
  await waitLocale();

  const pageKey = resolvePageKey(url.pathname);
  const pageConfig = pageConfigs[pageKey] ?? pageConfigs.home;

  return {
    meta: {
      title: pageConfig.title,
      description: pageConfig.description,
      url: `${siteConfig.url}${pageConfig.path}`,
      keywords: siteConfig.keywords
    }
  };
}

