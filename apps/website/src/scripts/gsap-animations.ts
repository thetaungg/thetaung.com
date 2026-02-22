import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Prevent extra layout reads on mobile resize/orientation changes
ScrollTrigger.config({ ignoreMobileResize: true });

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

    // Blobs are handled by CSS keyframe animations — no ScrollTrigger needed.
}

/**
 * Initialize Experience section animations
 * Uses ScrollTrigger.batch() to handle all items with 2 observers instead of N*2.
 */
function initExperienceAnimations() {
    const experience = document.querySelector('.experience');
    if (!experience) return;

    // Content slide in — one batch observer for all items
    ScrollTrigger.batch('.timeline-item__content', {
        onEnter: elements => {
            gsap.fromTo(
                elements,
                { x: -40, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.7,
                    ease: 'power2.out',
                    stagger: 0.1,
                },
            );
        },
        onLeaveBack: elements => {
            gsap.to(elements, { x: -40, opacity: 0, duration: 0.4, stagger: 0.05 });
        },
        start: 'top 85%',
    });

    // Dot pop — one batch observer for all dots
    ScrollTrigger.batch('.timeline-item__dot', {
        onEnter: elements => {
            gsap.fromTo(
                elements,
                { scale: 0 },
                {
                    scale: 1,
                    duration: 0.4,
                    ease: 'back.out(2)',
                    stagger: 0.1,
                },
            );
        },
        onLeaveBack: elements => {
            gsap.to(elements, { scale: 0, duration: 0.3, stagger: 0.05 });
        },
        start: 'top 85%',
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

    // Defer setup until the browser is idle so we don't force reflow during initial load/LCP.
    const runWhenIdle = () => {
        if (typeof requestIdleCallback !== 'undefined') {
            requestIdleCallback(setupAnimations, { timeout: 2500 });
        } else {
            setTimeout(setupAnimations, 300);
        }
    };
    if (document.readyState === 'complete') {
        runWhenIdle();
    } else {
        window.addEventListener('load', runWhenIdle);
    }
}

function setupAnimations() {
    // Double rAF: first lets DOM/layout settle, second runs after paint so we don’t
    // force reflow in the same tick as creating many ScrollTriggers.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            initHeroAnimations();
            initAboutAnimations();
            initSkillsAnimations();
            initExperienceAnimations();
            // Defer refresh; use safe:true so ScrollTrigger waits for layout to settle (less forced reflow).
            requestAnimationFrame(() => {
                ScrollTrigger.refresh(true);
            });
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
    // Refresh on resize; run inside rAF so we don’t force reflow in the same tick as resize.
    let resizeTimeout: ReturnType<typeof setTimeout>;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            requestAnimationFrame(() => {
                ScrollTrigger.refresh(true);
            });
        }, 200);
    });
}
