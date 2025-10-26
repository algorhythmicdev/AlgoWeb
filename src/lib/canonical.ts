export function canonicalFor(pathname: string) {
  const base = 'https://algorhythmicdev.github.io/AlgoWeb';
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${base}${path}`;
}
