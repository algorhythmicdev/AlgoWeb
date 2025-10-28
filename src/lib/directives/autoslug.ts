import { slugify } from '$lib/utils/slug';

export function autoslug(node: HTMLElement, levels: ('h2'|'h3')[] = ['h2','h3']) {
  const heads = node.querySelectorAll(levels.join(','));
  heads.forEach((h) => {
    const el = h as HTMLElement;
    if (!el.id) {
      const text = el.textContent?.trim() || '';
      el.id = slugify(text);
    }
  });
  return { destroy(){} };
}
