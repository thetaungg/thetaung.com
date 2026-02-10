import { Hono } from 'hono';

export const blogRoutes = new Hono();

// GET all blogs
blogRoutes.get('/', async c => {
    // TODO: Fetch from database
    const blogs = [{ id: '1', title: 'Hello World', slug: 'hello-world' }];

    return c.json({ blogs });
});

// GET single blog by slug
blogRoutes.get('/:slug', async c => {
    const slug = c.req.param('slug');

    // TODO: Fetch from database
    const blog = { id: '1', title: 'Hello World', slug, content: '...' };

    return c.json({ blog });
});
