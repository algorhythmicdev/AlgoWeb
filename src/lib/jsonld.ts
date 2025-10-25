type LD = Record<string, any>;

const ctx = 'https://schema.org';

function scriptTag(obj: LD) {
  const json = JSON.stringify(obj);
  return `<script type="application/ld+json">${json}</script>`;
}

/** Organization JSON-LD */
export function orgJsonLd(opts: {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}) {
  const ld = {
    '@context': ctx,
    '@type': 'Organization',
    name: opts.name,
    url: opts.url,
    ...(opts.logo ? { logo: opts.logo } : {}),
    ...(opts.sameAs?.length ? { sameAs: opts.sameAs } : {})
  };
  return scriptTag(ld);
}

/** Product JSON-LD (simplified) */
export function productJsonLd(opts: {
  name: string;
  url: string;
  description?: string;
  brand?: string;
  image?: string;
}) {
  const ld = {
    '@context': ctx,
    '@type': 'Product',
    name: opts.name,
    url: opts.url,
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.brand ? { brand: { '@type': 'Brand', name: opts.brand } } : {}),
    ...(opts.image ? { image: [opts.image] } : {})
  };
  return scriptTag(ld);
}

/** Breadcrumb JSON-LD */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  const ld = {
    '@context': ctx,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url
    }))
  };
  return scriptTag(ld);
}

/** FAQ JSON-LD */
export function faqJsonLd(faqs: { q: string; a: string }[]) {
  const ld = {
    '@context': ctx,
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
  return scriptTag(ld);
}
