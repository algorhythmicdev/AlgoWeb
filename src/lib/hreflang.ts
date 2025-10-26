const LOCALES = ['en','lv','ru'] as const;
export function hreflangLinks(pathname: string) {
  const base = 'https://algorhythmicdev.github.io/AlgoWeb';
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return LOCALES.map(l => `<link rel="alternate" hreflang="${l}" href="${base}${path}">`).join('\n')
       + `\n<link rel="alternate" hreflang="x-default" href="${base}${path}">`;
}
