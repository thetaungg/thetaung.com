import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

import { contactData } from '../../data/contact';
import ContactForm from '../ContactForm/ContactForm';
import styles from './Contact.module.scss';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
    const sectionRef = useRef<HTMLElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    // Scroll-triggered animations (deferred to batch layout reads into a single frame)
    useEffect(() => {
        let ctx: gsap.Context;
        const rafId = requestAnimationFrame(() => {
            ctx = gsap.context(() => {
                // Card fade up animation
                if (cardRef.current) {
                    gsap.fromTo(
                        cardRef.current,
                        { y: 100, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 1.2,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: sectionRef.current,
                                start: 'top 75%',
                                toggleActions: 'play none none reverse',
                            },
                        },
                    );
                }
            });
        });

        return () => {
            cancelAnimationFrame(rafId);
            ctx?.revert();
        };
    }, []);

    return (
        <section id="contact" ref={sectionRef} className={styles.contact} data-rev="2026-02-22">
            <div className={styles.contactContainer}>
                <div ref={cardRef} className={styles.contactCard}>
                    <div className={styles.contactHeader}>
                        <span className={styles.contactBadge}>Get in Touch</span>
                        <h2 className={styles.contactTitle}>
                            Let&apos;s build something <br />
                            <span className={styles.contactTitleAccent}>extraordinary.</span>
                        </h2>
                        <p className={styles.contactDescription}>{contactData.description}</p>
                    </div>

                    <div className={styles.contactForm}>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
