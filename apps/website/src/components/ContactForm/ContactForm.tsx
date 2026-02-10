import { GoogleReCaptchaProvider, useGoogleReCaptcha } from '@google-recaptcha/react';
import { useCallback, useState } from 'react';

import ArrowForwardIcon from '@/assets/icons/arrow-forward.svg?react';
import CheckCircleIcon from '@/assets/icons/check-circle.svg?react';
import ErrorIcon from '@/assets/icons/error.svg?react';
import { contactData } from '@/data/contact';
import { API_BASE_URL, GOOGLE_RECAPTCHA_SITE_KEY } from '@/utils/constants';

import styles from './ContactForm.module.scss';

interface FormData {
    name: string;
    email: string;
    message: string;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const ContactForm = () => {
    const googleReCaptcha = useGoogleReCaptcha();

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState<FormStatus>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            if (!googleReCaptcha) throw new Error('Google reCAPTCHA not initialized');

            setStatus('loading');
            setStatusMessage('');

            try {
                const recaptchaToken = await googleReCaptcha?.executeV3?.('contact_form');

                if (!recaptchaToken) throw new Error('Failed to get recaptcha token');

                const response = await fetch(`${API_BASE_URL}/api/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...formData, recaptchaToken }),
                });

                if (!response.ok) throw new Error('Failed to send message');

                setStatus('success');
                setStatusMessage("Message sent successfully! I'll get back to you soon.");
                setFormData({ name: '', email: '', message: '' });
            } catch (_e) {
                setStatus('error');
                setStatusMessage('Something went wrong. Please try again later.');
            }
        },
        [formData, googleReCaptcha],
    );

    const isLoading = status === 'loading';

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
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

            {statusMessage && (
                <div className={status === 'success' ? styles.statusSuccess : styles.statusError}>
                    {status === 'success' ? <CheckCircleIcon /> : <ErrorIcon />}
                    {statusMessage}
                </div>
            )}

            <div className={styles.footer}>
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
            </div>
        </form>
    );
};

const withRecaptcha = <P extends object>(
    Component: React.ComponentType<P>,
): React.ComponentType<P> => {
    return function WrappedWithRecaptcha(props: P) {
        return (
            <GoogleReCaptchaProvider type="v3" siteKey={GOOGLE_RECAPTCHA_SITE_KEY}>
                <Component {...props} />
            </GoogleReCaptchaProvider>
        );
    };
};

const ContactFormWithRecaptcha = withRecaptcha(ContactForm);

ContactFormWithRecaptcha.displayName = 'ContactForm';

export default ContactFormWithRecaptcha;
