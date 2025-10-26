<script lang="ts">
  import { base } from '$app/paths';
  const isExternal = (href: string) => /^(?:[a-z]+:|#)/i.test(href);
  const resolve = (href: string) => isExternal(href)
    ? href
    : href === '/'
      ? base || '/'
      : `${base}${href}`;
</script>
<section class="section">
  <div class="grid">
    <a class="card" href={resolve('/consulting')}><h3>Consulting</h3><p>Practical automation, data workflows, training.</p></a>
    <a class="card" href={resolve('/education')}><h3>Education</h3><p>Programs for Latvian schools and universities.</p></a>
  </div>
</section>
