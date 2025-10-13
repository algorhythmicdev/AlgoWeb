<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/icons/Icon.svelte';
  import { revealOnScroll, staggerReveal } from '$lib/animations';

  const hero = {
    eyebrow: 'Inside AlgoRhythmics',
    title: 'Calm AI, crafted in Riga and Rotterdam',
    subtitle:
      'We are a Latvian-born studio where algorithms and artistry share the same rhythm. Our work blends signage precision, inclusive design, and playful experimentation.',
    description:
      'Founded in 2025 by technologists and educators, AlgoRhythmics believes logic and creativity belong together. From AI platforms to classroom pilots, we choreograph solutions that explain themselves and invite collaboration.',
    primary: { label: 'Explore Our Services', href: '/services' },
    secondary: { label: 'Meet the Team', href: '#team' }
  };

  const values = [
    {
      icon: 'education',
      title: 'Education first',
      copy:
        'We nurture AI literacy in classrooms and community hubs. Free resources and respectful mentorship keep curiosity alive for every learner.'
    },
    {
      icon: 'target',
      title: 'Empowerment through technology',
      copy:
        'Whether you are a founder, teacher, or student, our tools are designed to feel welcoming, intuitive, and human-centred.'
    },
    {
      icon: 'idea',
      title: 'Innovation with integrity',
      copy:
        'Ethical guardrails, privacy, and transparency guide every release. We document automation decisions in plain language so trust stays intact.'
    },
    {
      icon: 'people',
      title: 'Community & collaboration',
      copy:
        'Partnerships with parents, cultural institutions, and industry mentors turn AI into a shared dance rather than a solo act.'
    }
  ];

  const story = {
    intro:
      'What began as a small startup in Riga has grown into a bridge between education, culture, and industry. Early collaborations with Latvia\'s Investment and Development Agency (LIAA) helped us champion AI education nationwide.',
    milestones: [
      'Launched pilot programmes in local schools where students built projects with our tools and saw their ideas come alive.',
      'Tailored Ideonautix for startups after listening to founders who needed calm, creative productivity support.',
      'Expanded partnerships with museums, libraries, and international conferences—proving that logic and art thrive together.'
    ],
    culture:
      'Inside the studio we host Logic/Dance sessions—one day a data science hackathon, the next an improv design workshop. This fusion of play and rigor shapes the experiences we ship.'
  };

  const team = [
    {
      name: 'Nikita Jurtaevs',
      role: 'Co-founder & CEO',
      focus: 'Signage craft, storytelling, and partner delivery',
      bio:
        'Nikita keeps product direction, accessibility, and partnerships aligned. He brings signage-floor realism to every interface and programme.',
      links: [
        { label: 'Email', href: 'mailto:nikita@algorhythmics.ai' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nikitajurtaevs/' }
      ]
    },
    {
      name: 'Vjaceslavs "Slaff" Trosins',
      role: 'Co-founder & CTO',
      focus: 'Cloud architecture, explainable AI, and operations',
      bio:
        'Slaff orchestrates engineering, data flows, and AI integrations. He connects hardware-grade discipline with transparent software experiences.',
      links: [
        { label: 'Email', href: 'mailto:slaff@algorhythmics.ai' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/slaff/' }
      ]
    }
  ];

  const finale = {
    title: 'Join the rhythm',
    copy:
      'We welcome collaborators who care about accessible technology, joyful learning, and responsible automation. Whether you are exploring careers, partnerships, or sponsorships, let’s build together.',
    primary: { label: 'Connect with AlgoRhythmics', href: '/contact' },
    secondary: { label: 'Subscribe to Updates', href: '/resources#newsletter' }
  };
</script>

<Hero variant="grid" title={hero.title} subtitle={hero.subtitle}>
  <svelte:fragment slot="status">
    <span class="hero-kicker surface-pill" data-tone="accent">{hero.eyebrow}</span>
  </svelte:fragment>
  <svelte:fragment slot="description">
    <p class="hero-description">{hero.description}</p>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <div class="hero-actions">
      <Button variant="gradient" size="lg" href={hero.primary.href}>{hero.primary.label}</Button>
      <Button variant="secondary" size="lg" href={hero.secondary.href}>{hero.secondary.label}</Button>
    </div>
  </svelte:fragment>
</Hero>

<section class="who-we-are" use:revealOnScroll>
  <div class="container who-we-are__grid">
    <GlassCard class="about-card" padding="lg">
      <h2>Who we are</h2>
      <p>{story.intro}</p>
      <p>
        {story.culture}
      </p>
    </GlassCard>
    <GlassCard class="about-card" padding="lg" halo>
      <h2>Our story</h2>
      <ul>
        {#each story.milestones as milestone (milestone)}
          <li>{milestone}</li>
        {/each}
      </ul>
      <div class="card-actions">
        <Button href="/resources#case-studies" variant="secondary" size="md">Read success stories</Button>
      </div>
    </GlassCard>
  </div>
</section>

<SectionDivider tone="neutral" />

<section class="values" aria-labelledby="values-heading" use:revealOnScroll>
  <div class="container">
    <header class="section-heading">
      <span class="section-eyebrow">Mission & values</span>
      <h2 id="values-heading">Where logic dances with creativity</h2>
      <p>
        Our mission is simple: make advanced AI accessible, enjoyable, and trustworthy. We pursue this mission through values that keep people at the centre.
      </p>
    </header>

    <div class="values__grid" use:staggerReveal>
      {#each values as value (value.title)}
        <GlassCard class="value-card" padding="lg">
          <div class="value-icon">
            <Icon name={value.icon} size={26} />
          </div>
          <h3>{value.title}</h3>
          <p>{value.copy}</p>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="aurora" />

<section class="team" id="team" use:revealOnScroll>
  <div class="container">
    <header class="section-heading">
      <span class="section-eyebrow">Founders & stewards</span>
      <h2>The people behind the rhythm</h2>
      <p>
        Our team spans AI researchers, designers, educators, and community builders. Meet the founders who set the tone for collaboration and craft.
      </p>
    </header>

    <div class="team__grid" use:staggerReveal>
      {#each team as member (member.name)}
        <GlassCard class="team-card" padding="lg" halo>
          <h3>{member.name}</h3>
          <span class="team-role">{member.role}</span>
          <p class="team-focus">Focus: {member.focus}</p>
          <p>{member.bio}</p>
          <div class="team-links">
            {#each member.links as link (link.href)}
              <a href={link.href}>{link.label}</a>
            {/each}
          </div>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<section class="finale" use:revealOnScroll>
  <div class="container">
    <GlassCard class="finale-card" halo padding="lg">
      <span class="section-eyebrow">Join us</span>
      <h2>{finale.title}</h2>
      <p>{finale.copy}</p>
      <div class="card-actions">
        <Button href={finale.primary.href} variant="gradient" size="lg">{finale.primary.label}</Button>
        <Button href={finale.secondary.href} variant="secondary" size="lg">{finale.secondary.label}</Button>
      </div>
    </GlassCard>
  </div>
</section>

<style>
  .hero-kicker {
    display: inline-flex;
    align-items: center;
    padding: 0.35rem 0.8rem;
    font-size: var(--text-small);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .hero-description {
    max-width: 70ch;
    margin: 0;
    color: var(--text-secondary);
    font-size: clamp(1.05rem, 2.6vw, 1.3rem);
    line-height: 1.6;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md, 1rem);
    align-items: center;
  }

  .who-we-are,
  .values,
  .team,
  .finale {
    padding: clamp(3.5rem, 8vw, 6rem) 0;
  }

  .who-we-are__grid,
  .values__grid,
  .team__grid {
    display: grid;
    gap: clamp(1.6rem, 3vw, 2.4rem);
  }

  :global(.about-card),
  :global(.value-card),
  :global(.team-card),
  :global(.finale-card) {
    display: grid;
    gap: clamp(1rem, 3vw, 1.6rem);
  }

  :global(.about-card) ul {
    margin: 0;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.45rem;
    color: var(--text-secondary);
    font-size: var(--text-small);
  }

  .section-heading {
    max-width: 70ch;
    margin: 0 auto clamp(2rem, 6vw, 3rem);
    text-align: center;
    display: grid;
    gap: 0.8rem;
  }

  .section-eyebrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem 0.9rem;
    border-radius: 999px;
    font-size: var(--text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    background: color-mix(in srgb, var(--bg-elev-2) 88%, rgba(var(--aurora-purple-rgb), 0.18) 12%);
    color: color-mix(in srgb, var(--aurora-purple) 72%, var(--text-secondary) 28%);
  }

  .value-icon {
    width: 3rem;
    height: 3rem;
    border-radius: var(--radius-full);
    display: inline-grid;
    place-items: center;
    background: color-mix(in srgb, var(--bg-elev-2) 82%, rgba(var(--voyage-blue-rgb), 0.18) 18%);
    color: var(--voyage-blue);
  }

  .team-role {
    font-size: var(--text-small);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .team-focus {
    font-weight: var(--weight-semibold);
    color: var(--text-secondary);
  }

  .team-links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm, 0.75rem);
  }

  .team-links a {
    color: var(--voyage-blue);
    font-weight: var(--weight-semibold);
  }

  .card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm, 0.75rem);
    align-items: center;
  }

  @media (min-width: 900px) {
    .who-we-are__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .values__grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .team__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .who-we-are,
    .values,
    .team,
    .finale {
      animation: none;
    }
  }
</style>


