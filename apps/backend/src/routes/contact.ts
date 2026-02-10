import { zValidator } from '@hono/zod-validator';
import FormData from 'form-data';
import { Hono } from 'hono';
import Mailgun from 'mailgun.js';
import { z } from 'zod';

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    message: z.string(),
    recaptchaToken: z.string().min(1, 'reCAPTCHA token is required'),
});

async function verifyRecaptcha(token: string): Promise<boolean> {
    const secretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
    if (!secretKey) throw new Error('GOOGLE_RECAPTCHA_SECRET_KEY is not set');

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret: secretKey, response: token }),
    });

    const result = (await response.json()) as { success: boolean; score?: number };

    return result.success && (result.score ?? 0) >= 0.5;
}

function getMailgunClient() {
    const apiKey = process.env.MAILGUN_API_KEY;
    if (!apiKey) throw new Error('MAILGUN_API_KEY is not set');

    const mailgun = new Mailgun(FormData);
    return mailgun.client({ username: 'api', key: apiKey });
}

export const contactRoutes = new Hono();

contactRoutes.post('/', zValidator('json', contactSchema), async c => {
    const { name, email, message, recaptchaToken } = c.req.valid('json');

    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
        return c.json({ success: false, message: 'reCAPTCHA verification failed' }, 400);
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
