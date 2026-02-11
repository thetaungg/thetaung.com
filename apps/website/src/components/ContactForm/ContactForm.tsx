import { useCallback, useRef, useState } from 'react';

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

interface FormData {
    name: string;
    email: string;
    message: string;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const ContactForm = () => {
    const turnstileContainerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const turnstileLoadedRef = useRef(false);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        message: '',
    });
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [status, setStatus] = useState<FormStatus>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    const loadTurnstile = useCallback(() => {
        if (turnstileLoadedRef.current || !TURNSTILE_SITE_KEY || !turnstileContainerRef.current)
            return;
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

        loadScript().then(() => {
            if (window.turnstile && turnstileContainerRef.current) {
                widgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
                    sitekey: TURNSTILE_SITE_KEY,
                    callback: (token: string) => setTurnstileToken(token),
                    'expired-callback': () => setTurnstileToken(null),
                });
            }
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            if (!turnstileToken) {
                setStatus('error');
                setStatusMessage('Please complete the verification challenge.');
                return;
            }

            setStatus('loading');
            setStatusMessage('');

            try {
                const response = await fetch(`${API_BASE_URL}/api/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...formData, turnstileToken }),
                });

                if (!response.ok) throw new Error('Failed to send message');

                setStatus('success');
                setStatusMessage("Message sent successfully! I'll get back to you soon.");
                setFormData({ name: '', email: '', message: '' });
                setTurnstileToken(null);
                if (window.turnstile && widgetIdRef.current) {
                    window.turnstile.reset(widgetIdRef.current);
                }
            } catch (_e) {
                setStatus('error');
                setStatusMessage('Something went wrong. Please try again later.');
                if (window.turnstile && widgetIdRef.current) {
                    window.turnstile.reset(widgetIdRef.current);
                    setTurnstileToken(null);
                }
            }
        },
        [formData, turnstileToken],
    );

    const isLoading = status === 'loading';

    return (
        <form onSubmit={handleSubmit} onFocus={loadTurnstile} className={styles.form}>
            <div className={styles.row}>
                <div className={styles.field}>
                    <div className={styles.textInput}>
                        <input
                            type="text"
                            id={contactData.form.fields.name.id}
                            name={contactData.form.fields.name.id}
                            required
                            value={formData.name}
                            onChange={handleChange}
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
                </div>

                <div className={styles.field}>
                    <div className={styles.textInput}>
                        <input
                            type="email"
                            id={contactData.form.fields.email.id}
                            name={contactData.form.fields.email.id}
                            required
                            value={formData.email}
                            onChange={handleChange}
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
            </div>

            <div className={styles.field}>
                <div className={styles.textarea}>
                    <textarea
                        id={contactData.form.fields.message.id}
                        name={contactData.form.fields.message.id}
                        required
                        value={formData.message}
                        onChange={handleChange}
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
            </div>

            <div
                ref={turnstileContainerRef}
                className={styles.turnstile}
                aria-label="Verification"
            />

            {statusMessage && (
                <div className={status === 'success' ? styles.statusSuccess : styles.statusError}>
                    {status === 'success' ? <CheckCircleIcon /> : <ErrorIcon />}
                    {statusMessage}
                </div>
            )}

            <div className={styles.footer}>
                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isLoading || !turnstileToken}>
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
            </div>
        </form>
    );
};

ContactForm.displayName = 'ContactForm';

export default ContactForm;
