import { base } from '$app/paths';

const PROTOCOL_REGEX = /^[a-z][a-z0-9+.-]*:/i;

export function withBase(path?: string | null): string | null | undefined {
  if (path == null) {
    return path ?? undefined;
  }

  if (typeof path !== 'string' || path.length === 0) {
    return path;
  }

  if (path.startsWith('#') || path.startsWith('//') || PROTOCOL_REGEX.test(path)) {
    return path;
  }

  if (!path.startsWith('/')) {
    return path;
  }

  return `${base}${path}`;
}

export function stripBase(pathname: string): string {
  if (!base || !pathname.startsWith(base)) {
    return pathname;
  }

  const stripped = pathname.slice(base.length);
  return stripped.length === 0 ? '/' : stripped;
}
