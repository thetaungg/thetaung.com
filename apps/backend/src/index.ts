import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

// import { blogRoutes } from './routes/blogs';
import { contactRoutes } from './routes/contact';

const app = new Hono();

app.use('*', logger());
app.use(
    '*',
    cors({
        origin: ['https://thetaung.com', 'http://localhost:4321'],
    }),
);

app.get('/', c => c.json({ message: 'thetaung.com API' }));

app.route('/api/contact', contactRoutes);
// app.route('/api/blogs', blogRoutes);

export default {
    port: process.env.PORT || 3001,
    fetch: app.fetch,
};
