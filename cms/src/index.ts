// import type { Core } from '@strapi/strapi';

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: any }) {
    if (process.env.STRAPI_SEED_SAMPLE_CONTENT !== 'true') {
      return;
    }

    const ensureSingle = async (uid: string, uniqueField: string, data: Record<string, unknown>) => {
      const existing = await strapi.db.query(uid).findOne({
        where: { [uniqueField]: data[uniqueField] },
        select: ['id']
      });
      if (existing) return existing.id;
      const created = await strapi.entityService.create(uid, { data });
      return created.id;
    };

    const ensureMany = async (
      uid: string,
      items: Array<{ uniqueField: string; data: Record<string, unknown> }>
    ) => Promise.all(items.map((item) => ensureSingle(uid, item.uniqueField, item.data)));

    const [aiEthicsId, curriculumId, platformUpdatesId] = await ensureMany('api::category.category', [
      {
        uniqueField: 'slug',
        data: {
          name: 'AI Ethics',
          slug: 'ai-ethics',
          description: 'Articles exploring responsible and accessible AI principles.'
        }
      },
      {
        uniqueField: 'slug',
        data: {
          name: 'Core Curriculum',
          slug: 'core-curriculum',
          description: 'Foundational learning modules for educators and teams.'
        }
      },
      {
        uniqueField: 'slug',
        data: {
          name: 'Platform Updates',
          slug: 'platform-updates',
          description: 'Announcements and deep dives for NodeVoyage and Ideonautix.'
        }
      }
    ]);

    const [accessibleAiId, edTechId, innovationId] = await ensureMany('api::tag.tag', [
      { uniqueField: 'name', data: { name: 'Accessible AI' } },
      { uniqueField: 'name', data: { name: 'Education Technology' } },
      { uniqueField: 'name', data: { name: 'Responsible Innovation' } }
    ]);

    const [janeId, alexId] = await ensureMany('api::author.author', [
      {
        uniqueField: 'email',
        data: {
          name: 'Dr. Jane Smith',
          email: 'jane.smith@example.com',
          role: 'Lead Researcher',
          bio: 'AI ethics researcher and educator guiding mindful innovation.'
        }
      },
      {
        uniqueField: 'email',
        data: {
          name: 'Alex Rivera',
          email: 'alex.rivera@example.com',
          role: 'Platform Strategist',
          bio: 'Designs playful learning journeys for NodeVoyage and Ideonautix.'
        }
      }
    ]);

    await ensureSingle('api::post.post', 'slug', {
      title: 'Introduction to Accessible AI',
      slug: 'introduction-to-accessible-ai',
      excerpt: 'Explore the principles of accessible, ethical AI development.',
      content:
        '# Why Accessible AI?\n\nAccessible AI favours mindful, responsible choices that protect communities while delivering value.\n\n## Key Takeaways\n- Human-centred guardrails\n- Transparent data journeys\n- Empowering educators and teams',
      publishDate: new Date().toISOString(),
      status: 'published',
      categories: [aiEthicsId, platformUpdatesId],
      tags: [accessibleAiId, innovationId],
      author: janeId
    });

    await ensureSingle('api::educational-module.educational-module', 'slug', {
      title: 'AI Ethics for Educators',
      slug: 'ai-ethics-for-educators',
      description: 'Workshop toolkit for guiding accessible AI conversations in the classroom.',
      content:
        '# Module Overview\n\nThis guided session introduces discussion prompts, case studies, and reflection exercises that help students articulate ethical AI boundaries.',
      publishDate: new Date().toISOString(),
      status: 'published',
      category: curriculumId,
      tags: [edTechId, innovationId],
      author: janeId
    });

    await ensureSingle('api::platform-article.platform-article', 'slug', {
      title: 'NodeVoyage Climate Missions Guide',
      slug: 'nodevoyage-climate-missions-guide',
      excerpt: 'Create climate-focused learning journeys that celebrate curiosity.',
      content:
        '# Create Impactful Missions\n\nBlend storytelling, tactile prompts, and reflective checkpoints to empower young explorers on climate topics.',
      publishDate: new Date().toISOString(),
      status: 'published',
      platformType: 'NodeVoyage',
      categories: [platformUpdatesId],
      tags: [edTechId],
      author: alexId
    });

    strapi.log.info('Sample Strapi content seeded (idempotent). Disable by unsetting STRAPI_SEED_SAMPLE_CONTENT.');
  }
};
