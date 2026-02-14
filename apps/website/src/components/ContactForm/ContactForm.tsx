import { useCallback, useEffect, useRef, useState } from 'react';

import ArrowForwardIcon from '@/assets/icons/arrow-forward.svg?react';
import CheckCircleIcon from '@/assets/icons/check-circle.svg?react';
import ErrorIcon from '@/assets/icons/error.svg?react';
import { contactData } from '@/data/contact';
import { API_BASE_URL, TURNSTILE_SITE_KEY } from '@/utils/constants';

import styles from './ContactForm.module.scss';

declare global {
    interface Window {
        turnstile?: {
            render: (
                container: string | HTMLElement,
                options: {
                    sitekey: string;
                    callback: (token: string) => void;
                    'error-callback'?: () => void;
                    'expired-callback'?: () => void;
                },
            ) => string;
            reset: (widgetId?: string) => void;
        };
    }
}

const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const ContactForm = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const turnstileLoadedRef = useRef(false);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const messageInputRef = useRef<HTMLTextAreaElement>(null);
    const turnstileTokenRef = useRef<string>(null);

    const [hydrated, setHydrated] = useState(false);
    const [status, setStatus] = useState<FormStatus>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => setHydrated(true), []);

    const loadTurnstile = useCallback(() => {
        if (turnstileLoadedRef.current || !TURNSTILE_SITE_KEY || !formRef.current) return;
        turnstileLoadedRef.current = true;

        const loadScript = (): Promise<void> => {
            if (window.turnstile) return Promise.resolve();
            const existing = document.querySelector(`script[src="${TURNSTILE_SCRIPT_URL}"]`);
            if (existing) return Promise.resolve();
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = TURNSTILE_SCRIPT_URL;
                script.async = true;
                script.defer = true;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Turnstile script failed to load'));
                document.head.appendChild(script);
            });
        };

        loadScript()
            .then(() => {
                if (window.turnstile && formRef.current) {
                    widgetIdRef.current = window.turnstile.render(formRef.current, {
                        sitekey: TURNSTILE_SITE_KEY,
                        callback: (token: string) => {
                            turnstileTokenRef.current = token;
                        },
                        'error-callback': () => {},
                        'expired-callback': () => {
                            turnstileTokenRef.current = null;
                        },
                    });
                }
            })
            .catch(() => {});
    }, []);

    // Load Turnstile when the form scrolls into view
    useEffect(() => {
        const form = formRef.current;
        if (!form) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadTurnstile();
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' },
        );

        observer.observe(form);
        return () => observer.disconnect();
    }, [loadTurnstile]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        setStatus('loading');
        setStatusMessage('');

        const cleanupTurnstile = () => {
            turnstileTokenRef.current = null;
            if (window.turnstile && widgetIdRef.current) {
                window.turnstile.reset(widgetIdRef.current);
            }
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...{
                        name: nameInputRef.current?.value ?? '',
                        email: emailInputRef.current?.value ?? '',
                        message: messageInputRef.current?.value ?? '',
                    },
                    ...(turnstileTokenRef.current
                        ? { turnstileToken: turnstileTokenRef.current }
                        : {}),
                }),
            });

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                throw new Error(
                    (body as { message?: string })?.message || 'Failed to send message',
                );
            }

            setStatus('success');
            setStatusMessage("Message sent successfully! I'll get back to you soon.");

            nameInputRef.current!.value = '';
            emailInputRef.current!.value = '';
            messageInputRef.current!.value = '';
        } catch (e) {
            setStatus('error');
            setStatusMessage(
                e instanceof Error ? e.message : 'Something went wrong. Please try again later.',
            );
        } finally {
            cleanupTurnstile();
        }
    }, []);

    const isLoading = status === 'loading';

    return (
        <form className={styles.form} ref={formRef} onSubmit={handleSubmit}>
            <div className={styles.formInner}>
                {/* Honeypot field — hidden from real users, bots will fill it */}
                {hydrated && (
                    <div className={styles.website} aria-hidden="true">
                        <label htmlFor="website">Website</label>
                        <input
                            type="text"
                            id="website"
                            name="website"
                            tabIndex={-1}
                            autoComplete="off"
                        />
                    </div>
                )}

                <div className={styles.row}>
                    <div className={styles.textInput}>
                        <input
                            ref={nameInputRef}
                            type="text"
                            id={contactData.form.fields.name.id}
                            name={contactData.form.fields.name.id}
                            required
                            placeholder={contactData.form.fields.name.placeholder}
                            className={styles.textInputField}
                            disabled={isLoading}
                        />
                        <label
                            htmlFor={contactData.form.fields.name.id}
                            className={styles.textInputLabel}>
                            {contactData.form.fields.name.label}
                        </label>
                    </div>

                    <div className={styles.textInput}>
                        <input
                            ref={emailInputRef}
                            type="email"
                            id={contactData.form.fields.email.id}
                            name={contactData.form.fields.email.id}
                            required
                            placeholder={contactData.form.fields.email.placeholder}
                            className={styles.textInputField}
                            disabled={isLoading}
                        />
                        <label
                            htmlFor={contactData.form.fields.email.id}
                            className={styles.textInputLabel}>
                            {contactData.form.fields.email.label}
                        </label>
                    </div>
                </div>

                <div className={styles.textarea}>
                    <textarea
                        ref={messageInputRef}
                        id={contactData.form.fields.message.id}
                        name={contactData.form.fields.message.id}
                        required
                        placeholder={contactData.form.fields.message.placeholder}
                        rows={5}
                        className={styles.textareaField}
                        disabled={isLoading}
                    />
                    <label
                        htmlFor={contactData.form.fields.message.id}
                        className={styles.textareaLabel}>
                        {contactData.form.fields.message.label}
                    </label>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <span className={styles.spinner} />
                            Sending...
                        </>
                    ) : (
                        <>
                            {contactData.form.submitLabel}
                            <ArrowForwardIcon />
                        </>
                    )}
                </button>

                {statusMessage && (
                    <div
                        className={
                            status === 'success' ? styles.statusSuccess : styles.statusError
                        }>
                        {status === 'success' ? <CheckCircleIcon /> : <ErrorIcon />}
                        {statusMessage}
                    </div>
                )}
            </div>
        </form>
    );
};

ContactForm.displayName = 'ContactForm';

export default ContactForm;
