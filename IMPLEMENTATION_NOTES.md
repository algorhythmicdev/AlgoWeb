# Implementation Notes

## Current Test Status
- `npm test` now passes after localising the dashboard and article surfaces.
- Keep running `npm run build` (or `npx svelte-kit sync`) before test runs so `.svelte-kit/tsconfig.json` stays in sync.

## Required Actions
1. **Regenerate SvelteKit config**
   - Run `npm run build` (or `npx svelte-kit sync`) before `npm test` so `.svelte-kit/tsconfig.json` exists.
2. **Localize literal text**
   - Replace the copied strings in the components below with i18n keys using `import { _ } from '$lib/i18n';` and `{$_('key.path')}`.
   - Add the keys (with English copy) to `src/lib/translations/en.json` and run `npm run i18n:check` to spot missing translations in other locales.
   - For non-translatable terms (product names, etc.), convert them into translation entries marked as identical across locales; the hygiene tests require every visible string to pass through the i18n layer.
   - Files to update:
     - `src/lib/components/AdminNav.svelte`
     - `src/routes/admin/+layout.svelte`
     - `src/routes/admin/+page.svelte`
     - `src/routes/blog/+page.svelte`
     - `src/routes/blog/[slug]/+page.svelte`
     - `src/routes/platform/+page.svelte`
     - `src/routes/platform/[slug]/+page.svelte`
     - `src/routes/education-hub/[slug]/+page.svelte`
3. **Rerun tests**
   - Execute `npm test` after copy updates to confirm `tests/content.spec.js` and `tests/unkeyed-text.spec.ts` stay green.

## Additional Context
- The failing assertions originate from `tests/content.spec.js` (`content hygiene > contains no unkeyed visible text nodes`) and `tests/unkeyed-text.spec.ts` (`i18n hygiene > does not contain unkeyed literal text in Svelte templates`).
- Each failing entry corresponds to user-facing copy intended for CMS integration; ensure the text appears in the translation dictionaries so it remains editable and consistent across locales.
