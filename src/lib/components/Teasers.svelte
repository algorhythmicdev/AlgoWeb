<script lang="ts">
  import { withBase } from '$utils/paths';

  const teasers = [
    { title: 'Consulting', body: 'Practical automation, data workflows, team training.', href: '/consulting' },
    { title: 'Education',  body: 'Programs for schools and universities in Latvia.', href: '/education' }
  ].map((t) => ({ ...t, resolved: withBase(t.href) ?? t.href }));
</script>

<section aria-label="Teasers" class="teasers">
  <h2 class="sr-only">Focus areas</h2>
  {#each teasers as t}
    <a class="teaser" href={t.resolved}>
      <h3>{t.title}</h3>
      <p>{t.body}</p>
    </a>
  {/each}
</section>

<style>
  .teasers { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); }
  .teaser { border: 1px dashed currentColor; padding: 1rem; border-radius: .5rem; }
</style>
