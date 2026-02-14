import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCallback, useEffect, useRef } from 'react';

import { type Project, projects, showcaseIntro } from '../../data/projects';
import type { OnSlideChangeCallback } from '../Carousel';
import { Carousel } from '../Carousel';
import { SectionBadge } from '../SectionBadge';
import ProjectCard from './ProjectCard';
import cardStyles from './ProjectCard.module.scss';
import styles from './ProjectShowcase.module.scss';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectShowcase() {
    const headerRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Scroll-triggered animations (deferred to batch layout reads into a single frame)
    useEffect(() => {
        let ctx: gsap.Context;
        const rafId = requestAnimationFrame(() => {
            ctx = gsap.context(() => {
                // Header animation
                if (headerRef.current) {
                    gsap.fromTo(
                        headerRef.current,
                        { y: 60, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 1.2,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: headerRef.current,
                                start: 'top 80%',
                                toggleActions: 'play none none reverse',
                            },
                        },
                    );
                }

                // Carousel viewport animation
                if (carouselRef.current) {
                    const viewport = carouselRef.current.querySelector('[role="region"]');
                    const controls =
                        carouselRef.current.querySelector(
                            '[role="region"]',
                        )?.previousElementSibling;
                    const progress =
                        carouselRef.current.querySelector('[role="region"]')?.nextElementSibling;

                    if (viewport) {
                        gsap.fromTo(
                            viewport,
                            { y: 80, opacity: 0 },
                            {
                                y: 0,
                                opacity: 1,
                                duration: 1.2,
                                ease: 'power3.out',
                                scrollTrigger: {
                                    trigger: viewport,
                                    start: 'top 85%',
                                    toggleActions: 'play none none reverse',
                                },
                            },
                        );

                        // Parallax effect for carousel
                        gsap.to(viewport, {
                            yPercent: -8,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: viewport,
                                start: 'top bottom',
                                end: 'bottom top',
                                scrub: 1,
                            },
                        });
                    }

                    // Controls animation
                    if (controls) {
                        gsap.fromTo(
                            controls,
                            { x: -40, opacity: 0 },
                            {
                                x: 0,
                                opacity: 1,
                                duration: 0.8,
                                ease: 'power2.out',
                                scrollTrigger: {
                                    trigger: controls,
                                    start: 'top 90%',
                                    toggleActions: 'play none none reverse',
                                },
                            },
                        );
                    }

                    // Progress dots animation
                    if (progress) {
                        gsap.fromTo(
                            progress,
                            { y: 20, opacity: 0 },
                            {
                                y: 0,
                                opacity: 1,
                                duration: 0.8,
                                ease: 'power2.out',
                                scrollTrigger: {
                                    trigger: progress,
                                    start: 'top 90%',
                                    toggleActions: 'play none none reverse',
                                },
                            },
                        );
                    }
                }
            });
        });

        return () => {
            cancelAnimationFrame(rafId);
            ctx?.revert();
        };
    }, []);

    // Content animations synced to the carousel's slide timeline
    const handleSlideChange: OnSlideChangeCallback = useCallback((tl, slide) => {
        const image = slide.querySelector(`.${cardStyles.slideImage}`);
        if (image) {
            tl.fromTo(
                image,
                { scale: 1.03 },
                { scale: 1, duration: 0.8, ease: 'power3.out', clearProps: 'transform' },
                0,
            );
        }

        const contentEls = slide.querySelectorAll(
            `.${cardStyles.slideHeader}, .${cardStyles.slideTech}, .${cardStyles.slideDescription}, .${cardStyles.slideFeatures}, .${cardStyles.slideCta}`,
        );
        if (contentEls.length > 0) {
            tl.fromTo(
                contentEls,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' },
                0.2,
            );
        }

        const slideNumber = slide.querySelector(`.${cardStyles.slideNumber}`);
        if (slideNumber) {
            tl.fromTo(
                slideNumber,
                { opacity: 0, scale: 0.85 },
                { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' },
                0.3,
            );
        }
    }, []);

    return (
        <section id="showcase" className={styles.showcase}>
            <div className={styles.showcaseContainer}>
                {/* Header */}
                <div ref={headerRef} className={styles.showcaseHeader}>
                    <SectionBadge text={showcaseIntro.badge} color="blue" />
                    <h2 className={styles.showcaseTitle}>
                        Recent
                        <br />
                        Work
                    </h2>
                    <p className={styles.showcaseDescription}>{showcaseIntro.description}</p>
                </div>

                {/* Carousel */}
                <div ref={carouselRef}>
                    <Carousel
                        items={projects}
                        renderSlide={(project: Project, index: number, isActive: boolean) => (
                            <ProjectCard project={project} index={index} isSlideActive={isActive} />
                        )}
                        onSlideChange={handleSlideChange}
                        slideClassName={styles.projectSlide}
                        slideAriaLabel={(project: Project) => `Go to ${project.title}`}
                    />
                </div>
            </div>
        </section>
    );
}
