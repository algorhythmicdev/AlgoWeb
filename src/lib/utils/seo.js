// @ts-nocheck

/**
 * SEO Utilities
 */

export function generateMetaTags({
  title = 'AlgoRhythmics - Where Logic Dances with Creativity',
  description = 'AI innovation lab creating NodeVoyage travel platform and Ideonautix productivity suite.',
  image = '/og-image.png',
  url = 'https://algorhythmics.com',
  type = 'website',
  locale = 'en_US'
}) {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type,
      locale,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image
    }
  };
}

export function generateStructuredData({
  type = 'Organization',
  name = 'AlgoRhythmics',
  description,
  url = 'https://algorhythmics.com',
  logo = 'https://algorhythmics.com/logo.png',
  foundingDate = '2025',
  founders = [],
  sameAs = []
}) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
    url,
    logo,
    foundingDate
  };
  
  if (founders.length > 0) {
    baseData.founder = founders.map(f => ({
      '@type': 'Person',
      name: f.name,
      jobTitle: f.role
    }));
  }
  
  if (sameAs.length > 0) {
    baseData.sameAs = sameAs;
  }
  
  return baseData;
}

export function generateBreadcrumbs(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function sanitizeForMeta(text) {
  return text
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
