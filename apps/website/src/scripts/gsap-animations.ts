import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Check for reduced motion preference
const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Initialize Hero section animations
 */
function initHeroAnimations() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Headline parallax - moves slower than scroll
    gsap.to('.hero__headline', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
        },
    });

    // Accent text fades as you scroll
    gsap.to('.hero__headline-accent', {
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: '50% top',
            scrub: 1,
        },
    });

    // Badge floats with different speed
    gsap.to('.hero__content .section-badge', {
        yPercent: 50,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
        },
    });

    // CTA buttons initial reveal - use set + to instead of from
    const ctaButtons = document.querySelectorAll('.hero__cta .hero__btn');
    if (ctaButtons.length) {
        gsap.fromTo(
            ctaButtons,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power2.out',
                delay: 0.3,
            },
        );
    }
}

/**
 * Initialize About section animations
 */
function initAboutAnimations() {
    const about = document.querySelector('.about');
    if (!about) return;

    const imageWrapper = document.querySelector('.about__image-wrapper');
    const aboutImage = document.querySelector('.about__image');
    const aboutContent = document.querySelector('.about__content');
    const aboutQuote = document.querySelector('.about__quote');

    // Image parallax reveal
    if (imageWrapper) {
        gsap.fromTo(
            imageWrapper,
            { y: 80, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.about',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            },
        );
    }

    // Image inner parallax (slower than container)
    if (aboutImage) {
        gsap.to(aboutImage, {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: {
                trigger: '.about__image-wrapper',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
        });
    }

    // Content slide in
    if (aboutContent) {
        gsap.fromTo(
            aboutContent,
            { x: 60, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.about',
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                },
            },
        );
    }

    // Quote delayed reveal
    if (aboutQuote) {
        gsap.fromTo(
            aboutQuote,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.about__quote',
                    start: 'top 90%',
                    toggleActions: 'play none none reverse',
                },
            },
        );
    }
}

/**
 * Initialize Skills section animations
 */
function initSkillsAnimations() {
    const skills = document.querySelector('.skills');
    if (!skills) return;

    const skillsHeader = document.querySelector('.skills__header');
    const skillBubbles = document.querySelectorAll('.skill-bubble');

    // Header fade up
    if (skillsHeader) {
        gsap.fromTo(
            skillsHeader,
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.skills',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            },
        );
    }

    // Skill bubbles staggered reveal
    if (skillBubbles.length) {
        gsap.fromTo(
            skillBubbles,
            { scale: 0, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                stagger: {
                    each: 0.05,
                    from: 'random',
                },
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: '.skills__grid',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
                clearProps: 'scale',
            },
        );
    }

    // Blobs scroll-linked movement
    gsap.to('.skills__blob--1', {
        yPercent: -20,
        xPercent: 10,
        ease: 'none',
        scrollTrigger: {
            trigger: '.skills',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
        },
    });

    gsap.to('.skills__blob--2', {
        yPercent: 30,
        xPercent: -15,
        ease: 'none',
        scrollTrigger: {
            trigger: '.skills',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
        },
    });

    gsap.to('.skills__blob--3', {
        yPercent: -25,
        ease: 'none',
        scrollTrigger: {
            trigger: '.skills',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
        },
    });
}

/**
 * Initialize Experience section animations
 */
function initExperienceAnimations() {
    const experience = document.querySelector('.experience');
    if (!experience) return;

    // Timeline items staggered reveal
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach(element => {
        const dot = element.querySelector('.timeline-item__dot');
        const content = element.querySelector('.timeline-item__content');

        // Content slide in
        if (content) {
            gsap.fromTo(
                content,
                { x: -40, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.7,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                },
            );
        }

        // Dot pop animation
        if (dot) {
            gsap.fromTo(
                dot,
                { scale: 0 },
                {
                    scale: 1,
                    duration: 0.4,
                    ease: 'back.out(2)',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                },
            );
        }
    });
}

/**
 * Main initialization function
 */
export function initAllAnimations() {
    // Skip animations if user prefers reduced motion
    if (prefersReducedMotion()) {
        console.log('Reduced motion preference detected, skipping animations');
        return;
    }

    // Wait for page to be fully loaded and rendered
    if (document.readyState === 'complete') {
        setupAnimations();
    } else {
        window.addEventListener('load', setupAnimations);
    }
}

function setupAnimations() {
    // Small delay to ensure all elements are rendered
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            initHeroAnimations();
            initAboutAnimations();
            initSkillsAnimations();
            initExperienceAnimations();
            // Refresh ScrollTrigger after all animations are set up
            ScrollTrigger.refresh();
        });
    });
}

/**
 * Cleanup function for navigation
 */
export function cleanupAnimations() {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
    // Refresh on resize
    let resizeTimeout: ReturnType<typeof setTimeout>;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 200);
    });
}
