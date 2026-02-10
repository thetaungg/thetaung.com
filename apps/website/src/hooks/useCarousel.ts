import gsap from 'gsap';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ============================================
// ANIMATION CONFIG TYPES
// ============================================
export interface SlideAnimationConfig {
    duration: number;
    xDistance?: number;
    scale: number;
    ease: string;
    delay?: number;
}

export interface CounterAnimationConfig {
    duration: number;
    yOffset: number;
}

export interface PeekConfig {
    scale: number;
    opacity: number;
    position: number;
    hiddenPosition: number;
}

export interface ActiveConfig {
    scale: number;
}

export interface CarouselAnimationConfig {
    slideOut: SlideAnimationConfig;
    slideIn: SlideAnimationConfig;
    counter: CounterAnimationConfig;
    peek: PeekConfig;
    active: ActiveConfig;
}

// ============================================
// DEFAULT ANIMATION CONFIG
// ============================================
export const DEFAULT_ANIMATION_CONFIG: CarouselAnimationConfig = {
    slideOut: {
        duration: 0.6,
        xDistance: 80,
        scale: 0.9,
        ease: 'power3.inOut',
    },
    slideIn: {
        duration: 0.6,
        delay: 0,
        scale: 0.9,
        ease: 'power3.out',
    },
    counter: {
        duration: 0.3,
        yOffset: 15,
    },
    peek: {
        scale: 0.85,
        opacity: 0.5,
        position: 100,
        hiddenPosition: 125,
    },
    active: {
        scale: 1.05,
    },
};

// ============================================
// CALLBACK TYPES
// ============================================
export type OnSlideChangeCallback = (
    timeline: gsap.core.Timeline,
    slide: HTMLElement,
    index: number,
    direction: 'next' | 'prev',
) => void;

// ============================================
// HOOK OPTIONS & RETURN TYPES
// ============================================
export interface UseCarouselOptions {
    totalSlides: number;
    animationConfig?: Partial<CarouselAnimationConfig>;
    enableKeyboardNav?: boolean;
    enableTouchNav?: boolean;
    swipeThreshold?: number;
    onSlideChange?: OnSlideChangeCallback;
}

export interface UseCarouselReturn {
    currentIndex: number;
    slidesRef: React.MutableRefObject<(HTMLElement | null)[]>;
    counterRef: React.RefObject<HTMLSpanElement | null>;
    viewportRef: React.RefObject<HTMLDivElement | null>;
    goToSlide: (index: number, direction: 'next' | 'prev') => void;
    next: () => void;
    prev: () => void;
    touchHandlers: {
        onTouchStart: (e: React.TouchEvent) => void;
        onTouchMove: (e: React.TouchEvent) => void;
        onTouchEnd: () => void;
    };
    registerSlide: (index: number) => (el: HTMLElement | null) => void;
}

// ============================================
// DEEP MERGE UTILITY
// ============================================
function deepMerge(
    target: CarouselAnimationConfig,
    source: Partial<CarouselAnimationConfig>,
): CarouselAnimationConfig {
    const result = { ...target };
    for (const key in source) {
        const k = key as keyof CarouselAnimationConfig;
        const sourceVal = source[k];
        if (sourceVal && typeof sourceVal === 'object' && !Array.isArray(sourceVal)) {
            result[k] = { ...target[k], ...sourceVal } as never;
        } else if (sourceVal !== undefined) {
            result[k] = sourceVal as never;
        }
    }
    return result;
}

// ============================================
// USE CAROUSEL HOOK
// ============================================
export function useCarousel({
    totalSlides,
    animationConfig: configOverrides,
    enableKeyboardNav = true,
    enableTouchNav = true,
    swipeThreshold = 50,
    onSlideChange,
}: UseCarouselOptions): UseCarouselReturn {
    const config = useMemo(
        () => deepMerge(DEFAULT_ANIMATION_CONFIG, configOverrides ?? {}),
        [configOverrides],
    );

    const [currentIndex, setCurrentIndex] = useState(0);
    const currentIndexRef = useRef(0);
    const slidesRef = useRef<(HTMLElement | null)[]>([]);
    const counterRef = useRef<HTMLSpanElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const onSlideChangeRef = useRef(onSlideChange);
    onSlideChangeRef.current = onSlideChange;

    // Register slide ref callback
    const registerSlide = useCallback(
        (index: number) => (el: HTMLElement | null) => {
            slidesRef.current[index] = el;
        },
        [],
    );

    // Initialize slides on mount with adjacent peek effect
    useEffect(() => {
        const slides = slidesRef.current.filter(Boolean);
        const numSlides = slides.length;

        if (numSlides > 0) {
            slides.forEach((slide, i) => {
                if (i === 0) {
                    gsap.set(slide, {
                        opacity: 1,
                        x: '0%',
                        scale: config.active.scale,
                        zIndex: 2,
                    });
                } else if (i === 1) {
                    gsap.set(slide, {
                        opacity: config.peek.opacity,
                        x: `${config.peek.position}%`,
                        scale: config.peek.scale,
                        zIndex: 1,
                    });
                } else if (i === numSlides - 1) {
                    gsap.set(slide, {
                        opacity: config.peek.opacity,
                        x: `-${config.peek.position}%`,
                        scale: config.peek.scale,
                        zIndex: 1,
                    });
                } else {
                    gsap.set(slide, {
                        opacity: 0,
                        x: `${config.peek.hiddenPosition}%`,
                        scale: 0.8,
                        zIndex: 0,
                    });
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const goToSlide = useCallback(
        (index: number, direction: 'next' | 'prev') => {
            if (index === currentIndexRef.current) return;

            const slides = slidesRef.current;
            const nextSlide = slides[index];

            if (timelineRef.current) {
                timelineRef.current.kill();
            }

            currentIndexRef.current = index;
            setCurrentIndex(index);

            const numSlides = slides.length;
            const newPrevPeekIndex = index === 0 ? numSlides - 1 : index - 1;
            const newNextPeekIndex = index === numSlides - 1 ? 0 : index + 1;

            const { position: peekPosition, hiddenPosition } = config.peek;

            // Pre-position slides that need to wrap around
            slides.forEach((slide, i) => {
                if (!slide) return;

                if (i === index) {
                    if (direction === 'prev') {
                        gsap.set(slide, {
                            x: `-${hiddenPosition}%`,
                            opacity: 0,
                            zIndex: 0,
                        });
                    } else {
                        gsap.set(slide, { x: `${hiddenPosition}%`, opacity: 0, zIndex: 0 });
                    }
                } else if (i === newPrevPeekIndex && direction === 'prev') {
                    const currentX = gsap.getProperty(slide, 'x') as number;
                    if (currentX > 0) {
                        gsap.set(slide, { x: `-${hiddenPosition}%`, opacity: 0 });
                    }
                } else if (i === newNextPeekIndex && direction === 'next') {
                    const currentX = gsap.getProperty(slide, 'x') as number;
                    if (currentX < 0) {
                        gsap.set(slide, { x: `${hiddenPosition}%`, opacity: 0 });
                    }
                }
            });

            const tl = gsap.timeline();
            timelineRef.current = tl;

            // Animate counter
            if (counterRef.current) {
                tl.to(
                    counterRef.current,
                    {
                        opacity: 0,
                        y: -config.counter.yOffset,
                        duration: config.counter.duration,
                        onComplete: () => {
                            if (counterRef.current) {
                                counterRef.current.textContent = String(index + 1).padStart(2, '0');
                            }
                        },
                    },
                    0,
                );
                tl.to(
                    counterRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: config.counter.duration,
                    },
                    config.counter.duration,
                );
            }

            // Animate slides
            slides.forEach((slide, i) => {
                if (!slide) return;

                let targetX: string;
                let targetOpacity: number;
                let targetScale: number;
                let targetZIndex: number;

                if (i === index) {
                    targetX = '0%';
                    targetOpacity = 1;
                    targetScale = config.active.scale;
                    targetZIndex = 2;
                } else if (i === newPrevPeekIndex) {
                    targetX = `-${peekPosition}%`;
                    targetOpacity = config.peek.opacity;
                    targetScale = config.peek.scale;
                    targetZIndex = 1;
                } else if (i === newNextPeekIndex) {
                    targetX = `${peekPosition}%`;
                    targetOpacity = config.peek.opacity;
                    targetScale = config.peek.scale;
                    targetZIndex = 1;
                } else {
                    targetX = direction === 'next' ? `-${hiddenPosition}%` : `${hiddenPosition}%`;
                    targetOpacity = 0;
                    targetScale = 0.8;
                    targetZIndex = 0;
                }

                tl.to(
                    slide,
                    {
                        opacity: targetOpacity,
                        x: targetX,
                        scale: targetScale,
                        zIndex: targetZIndex,
                        duration: config.slideIn.duration,
                        ease: config.slideIn.ease,
                    },
                    0,
                );
            });

            // Let the consumer add their own animations to the timeline
            if (nextSlide && onSlideChangeRef.current) {
                onSlideChangeRef.current(tl, nextSlide, index, direction);
            }
        },
        [config],
    );

    const next = useCallback(() => {
        const nextIndex =
            currentIndexRef.current < totalSlides - 1 ? currentIndexRef.current + 1 : 0;
        goToSlide(nextIndex, 'next');
    }, [totalSlides, goToSlide]);

    const prev = useCallback(() => {
        const prevIndex =
            currentIndexRef.current > 0 ? currentIndexRef.current - 1 : totalSlides - 1;
        goToSlide(prevIndex, 'prev');
    }, [totalSlides, goToSlide]);

    // Keyboard navigation
    useEffect(() => {
        if (!enableKeyboardNav) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [enableKeyboardNav, next, prev]);

    // Touch handlers
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.changedTouches[0].screenX;
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        touchEndX.current = e.changedTouches[0].screenX;
    }, []);

    const handleTouchEnd = useCallback(() => {
        if (!enableTouchNav) return;

        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) next();
            else prev();
        }
        touchStartX.current = 0;
        touchEndX.current = 0;
    }, [enableTouchNav, swipeThreshold, next, prev]);

    return {
        currentIndex,
        slidesRef,
        counterRef,
        viewportRef,
        goToSlide,
        next,
        prev,
        touchHandlers: {
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
        },
        registerSlide,
    };
}
