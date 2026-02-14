import { zValidator } from '@hono/zod-validator';
import FormData from 'form-data';
import type { Context, Next } from 'hono';
import { Hono } from 'hono';
import Mailgun from 'mailgun.js';
import { z } from 'zod';

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    message: z.string(),
    turnstileToken: z.string().optional(),
    website: z.string().optional(), // honeypot field
});

// --- IP-based rate limiter ---
const RATE_LIMIT_MAX = 5; // max requests per window
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 15 minutes

const ipRequestLog = new Map<string, number[]>();

// Clean up expired entries every 30 minutes
setInterval(
    () => {
        const now = Date.now();
        for (const [ip, timestamps] of ipRequestLog) {
            const valid = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
            if (valid.length === 0) {
                ipRequestLog.delete(ip);
            } else {
                ipRequestLog.set(ip, valid);
            }
        }
    },
    30 * 60 * 1000,
);

function getClientIp(c: Context): string {
    return (
        c.req.header('cf-connecting-ip') ??
        c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ??
        '0.0.0.0'
    );
}

async function rateLimit(c: Context, next: Next) {
    const ip = getClientIp(c);
    const now = Date.now();

    const timestamps = (ipRequestLog.get(ip) ?? []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);

    if (timestamps.length >= RATE_LIMIT_MAX) {
        const oldestValid = timestamps[0];
        const retryAfterSecs = Math.ceil((oldestValid + RATE_LIMIT_WINDOW_MS - now) / 1000);

        c.header('Retry-After', String(retryAfterSecs));
        return c.json(
            { success: false, message: 'Too many requests. Please try again later.' },
            429,
        );
    }

    timestamps.push(now);
    ipRequestLog.set(ip, timestamps);
    await next();
}

// --- Turnstile verification ---
async function verifyTurnstile(token: string): Promise<boolean> {
    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) throw new Error('TURNSTILE_SECRET_KEY is not set');

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret: secretKey, response: token }),
    });

    const result = (await response.json()) as { success: boolean };

    return result.success === true;
}

function getMailgunClient() {
    const apiKey = process.env.MAILGUN_API_KEY;
    if (!apiKey) throw new Error('MAILGUN_API_KEY is not set');

    const mailgun = new Mailgun(FormData);
    return mailgun.client({ username: 'api', key: apiKey });
}

export const contactRoutes = new Hono();

contactRoutes.post('/', rateLimit, zValidator('json', contactSchema), async c => {
    const { name, email, message, turnstileToken, website } = c.req.valid('json');

    // Honeypot check — real users won't fill this field
    if (website) {
        return c.json({ success: true, message: 'Message sent successfully' });
    }

    // Only verify Turnstile if a token was provided
    if (turnstileToken) {
        const isHuman = await verifyTurnstile(turnstileToken);
        if (!isHuman) {
            return c.json({ success: false, message: 'Verification failed' }, 400);
        }
    }

    const domain = process.env.MAILGUN_DOMAIN;
    const recipientEmail = process.env.CONTACT_EMAIL;
    if (!domain || !recipientEmail) {
        throw new Error('MAILGUN_DOMAIN or CONTACT_EMAIL is not set');
    }

    const mg = getMailgunClient();

    await mg.messages.create(domain, {
        from: `Portfolio Contact <noreply@${domain}>`,
        to: [recipientEmail],
        subject: `New contact from ${name}`,
        'h:Reply-To': email,
        text: [`Name: ${name}`, `Email: ${email}`, '', 'Message:', message].join('\n'),
        html: [
            `<h2>New Contact Form Submission</h2>`,
            `<p><strong>Name:</strong> ${name}</p>`,
            `<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>`,
            `<hr />`,
            `<p><strong>Message:</strong></p>`,
            `<p>${message.replace(/\n/g, '<br />')}</p>`,
        ].join('\n'),
    });

    return c.json({ success: true, message: 'Message sent successfully' });
});
