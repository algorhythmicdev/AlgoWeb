<script lang="ts">
  // Static, accessible; no auto-advance
  export let items = [
    { quote: 'They solved a real workflow bottleneck in a week.', by: 'Founder, local startup' },
    { quote: 'Clear, hands-on training. Team productivity went up.', by: 'School program lead' }
  ];
  let current = 0;
  function next() { current = (current + 1) % items.length; }
  function prev() { current = (current - 1 + items.length) % items.length; }
</script>

<section aria-label="Testimonials">
  <h2 class="visually-hidden">Testimonials</h2>
  <div role="group" aria-roledescription="carousel" aria-label="Testimonials">
    <blockquote>
      <p>“{items[current].quote}”</p>
      <footer>— {items[current].by}</footer>
    </blockquote>
    <div>
      <button type="button" on:click={prev} aria-label="Previous testimonial">Prev</button>
      <button type="button" on:click={next} aria-label="Next testimonial">Next</button>
    </div>
  </div>
</section>

<style>
  section { gap: 1.5rem; }
  blockquote { margin: 0; font-size: 1.1rem; line-height: 1.6; }
  blockquote footer { margin-top: .5rem; color: var(--text-subtle); font-size: .9rem; }
  button {
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text);
    padding: .4rem .8rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background var(--dur) var(--ease), transform var(--dur) var(--ease);
  }
  button:hover,
  button:focus-visible { background: color-mix(in oklab, var(--surface) 88%, transparent); transform: translateY(-1px); }
  div { display: flex; gap: .75rem; }
</style>
