import type { LayoutLoad } from './$types';
import { pageConfigs, siteConfig } from '$config/seo';
import { initI18n } from '$lib/i18n';

export const prerender = true;

type RouteKey = keyof typeof pageConfigs;

type RouteMapping = {
  key: RouteKey;
  patterns: RegExp[];
};

const ROUTE_MAPPINGS: RouteMapping[] = [
  { key: 'home', patterns: [/^\/$/] },
  {
    key: 'products',
    patterns: [/^\/products(\/?|$)/, /^\/platform(\/?|$)/, /^\/nodevoyage(\/?|$)/, /^\/ideonautix(\/?|$)/]
  },
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

function resolvePageKey(pathname: string): RouteKey {
  const normalised = pathname.replace(/\/+$/, '') || '/';
  const entry = ROUTE_MAPPINGS.find(({ patterns }) => patterns.some((pattern) => pattern.test(normalised)));
  return entry?.key ?? 'home';
}

export const load: LayoutLoad = async ({ url, data }) => {
  await initI18n('en');

  const pageKey = resolvePageKey(url.pathname);
  const pageConfig = pageConfigs[pageKey] ?? pageConfigs.home;

  return {
    ...data,
    locale: 'en',
    meta: {
      title: pageConfig.title,
      description: pageConfig.description,
      url: `${siteConfig.url}${pageConfig.path}`,
      keywords: siteConfig.keywords
    }
  };
};
