export function stripTrailingSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export function ensureLeadingSlash(path: string): string {
  if (!path) {
    return '/';
  }
  return path.startsWith('/') ? path : `/${path}`;
}
