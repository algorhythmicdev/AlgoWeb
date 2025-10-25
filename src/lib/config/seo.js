import { assets, base } from '$app/paths';

/**
 * SEO Configuration
 */

/**
 * @param {string} value
 */
const stripTrailingSlash = (value) => value.replace(/\/$/, '');

/**
 * @param {string} value
 */
const ensureLeadingSlash = (value) => (value.startsWith('/') ? value : `/${value}`);

const rawSiteUrl = stripTrailingSlash(import.meta.env?.PUBLIC_SITE_URL || 'https://algorhythmics.dev');
const normalizedBase = base && base !== '/' ? ensureLeadingSlash(stripTrailingSlash(base)) : '';

const siteUrlIncludesBase =
  normalizedBase && !rawSiteUrl.endsWith(normalizedBase)
    ? `${rawSiteUrl}${normalizedBase}`
    : rawSiteUrl;

let siteOrigin;
try {
  siteOrigin = new URL(siteUrlIncludesBase).origin;
} catch (error) {
  if (import.meta.env?.PUBLIC_SITE_URL) {
    console.warn('Invalid PUBLIC_SITE_URL, falling back to raw value for origin.', error);
  }
  siteOrigin = siteUrlIncludesBase;
}

const normalizedAssetsBase = assets ? stripTrailingSlash(assets) : '';
const assetBase = normalizedAssetsBase || normalizedBase;
const isExternalAssetBase = /^(?:[a-z]+:)?\/\//i.test(assetBase);

export const SITE_URL = siteUrlIncludesBase;

/**
 * @param {string} path
 * @returns {string}
 */
export const buildAssetPath = (path) => {
  const normalized = ensureLeadingSlash(path);
  if (!assetBase) return normalized;
  return `${assetBase}${normalized}`;
};

/**
 * @param {string} path
 * @returns {string}
 */
export const buildAssetUrl = (path) => {
  const resolvedPath = buildAssetPath(path);
  return isExternalAssetBase ? resolvedPath : `${siteOrigin}${resolvedPath}`;
};

const OG_IMAGE_PATH = buildAssetUrl('og-image.svg');
const BRAND_LOGO_LIGHT = buildAssetUrl('images/brand/logo-main.png');
const BRAND_LOGO_DARK = buildAssetUrl('images/brand/logo-white.png');
const BRAND_LOGO_ICON = buildAssetUrl('images/brand/logo-icon.png');

export const siteConfig = {
  name: 'AlgoRhythmics',
  title: 'AlgoRhythmics - Where Logic Dances with Creativity',
  description: 'AI innovation lab creating NodeVoyage travel platform and Ideonautix productivity suite. Pre-company phase, building Latvia\'s AI future from Daugavpils.',
  url: SITE_URL,
  ogImage: OG_IMAGE_PATH,
  logos: {
    light: BRAND_LOGO_LIGHT,
    dark: BRAND_LOGO_DARK,
    icon: BRAND_LOGO_ICON
  },
  keywords: [
    'AI Latvia',
    'Daugavpils startup',
    'NodeVoyage',
    'Ideonautix',
    'AI travel planning',
    'productivity tools',
    'Ideju Kauss 2025',
    'AlgoRhythmics'
  ],
  founders: [
    {
      name: 'Nikita Jurtaevs',
      role: 'Co-Founder & CEO'
    },
    {
      name: 'Vjaceslavs "Slaff" Trosins',
      role: 'Co-Founder & CTO'
    }
  ],
  contact: {
    email: 'help@algorhythmics.dev',
    location: 'Latvia · Remote-first'
  },
  social: {
    linkedin: 'https://linkedin.com/company/algorhythmics',
    github: 'https://github.com/algorhythmics'
  }
};

