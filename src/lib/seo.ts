export type MetaInput = {
  title: string;
  description?: string;
  image?: string;
  lang?: string;
};

export function Head({ title, description, image, lang }: MetaInput) {
  return `
    <title>${escape(title)} — Algorhythmics</title>
    ${description ? `<meta name="description" content="${escape(description)}" />` : ''}
    <meta property="og:title" content="${escape(title)} — Algorhythmics" />
    ${description ? `<meta property="og:description" content="${escape(description)}" />` : ''}
    ${image ? `<meta property="og:image" content="${escape(image)}" />` : ''}
    ${lang ? `<meta property="og:locale" content="${escape(lang)}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
  `;
}

function escape(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
