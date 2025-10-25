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
  <h2 class="sr-only">Testimonials</h2>
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
