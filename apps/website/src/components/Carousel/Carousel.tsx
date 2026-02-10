import typedMemo from '@/hocs/typedMemo';
import { useCarousel } from '@/hooks/useCarousel';

import styles from './Carousel.module.scss';
import type { CarouselItem, CarouselProps } from './types';

function Carousel<T extends CarouselItem>({
    items,
    renderSlide,
    animationConfig,
    enableKeyboardNav = true,
    enableTouchNav = true,
    swipeThreshold = 50,
    showCounter = true,
    showDots = true,
    showArrows = true,
    renderCounter,
    renderDot,
    renderArrows,
    onSlideChange,
    className,
    slideClassName,
    viewportClassName,
    trackClassName,
    controlsClassName,
    dotsClassName,
    style,
    ariaLabel = 'Carousel',
    slideAriaLabel,
}: CarouselProps<T>) {
    const {
        currentIndex,
        counterRef,
        viewportRef,
        goToSlide,
        next,
        prev,
        touchHandlers,
        registerSlide,
    } = useCarousel({
        totalSlides: items.length,
        animationConfig,
        enableKeyboardNav,
        enableTouchNav,
        swipeThreshold,
        onSlideChange,
    });

    const totalSlides = items.length;

    // Default counter renderer
    const defaultRenderCounter = () => (
        <div className={styles.carouselCounter}>
            <span ref={counterRef} className={styles.carouselCurrent}>
                01
            </span>
            <span className={styles.carouselDivider}>/</span>
            <span className={styles.carouselTotal}>{String(totalSlides).padStart(2, '0')}</span>
        </div>
    );

    // Default arrows renderer
    const defaultRenderArrows = () => (
        <div className={styles.carouselNav}>
            <button className={styles.carouselBtn} onClick={prev} aria-label="Previous slide">
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>
            <button className={styles.carouselBtn} onClick={next} aria-label="Next slide">
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </button>
        </div>
    );

    // Default dot renderer
    const defaultRenderDot = (index: number, isActive: boolean, onClick: () => void) => (
        <button
            key={items[index].id}
            className={`${styles.carouselDot} ${isActive ? styles.carouselDotActive : ''}`}
            onClick={onClick}
            aria-label={
                slideAriaLabel ? slideAriaLabel(items[index], index) : `Go to slide ${index + 1}`
            }>
            <span className={styles.carouselDotFill} />
        </button>
    );

    return (
        <div
            className={`${styles.carousel} ${className ?? ''}`}
            style={style}
            role="region"
            aria-label={ariaLabel}>
            {/* Controls */}
            {(showCounter || showArrows) && (
                <div className={`${styles.carouselControls} ${controlsClassName ?? ''}`}>
                    {showCounter &&
                        (renderCounter
                            ? renderCounter(currentIndex + 1, totalSlides, counterRef)
                            : defaultRenderCounter())}
                    {showArrows &&
                        (renderArrows ? renderArrows(prev, next) : defaultRenderArrows())}
                </div>
            )}

            {/* Slides */}
            <div
                ref={viewportRef}
                className={`${styles.carouselViewport} ${viewportClassName ?? ''}`}
                onTouchStart={touchHandlers.onTouchStart}
                onTouchMove={touchHandlers.onTouchMove}
                onTouchEnd={touchHandlers.onTouchEnd}>
                <div className={`${styles.carouselTrack} ${trackClassName ?? ''}`}>
                    {items.map((item, index) => (
                        <article
                            key={item.id}
                            ref={registerSlide(index)}
                            className={`${styles.carouselSlide} ${slideClassName ?? ''}`}
                            data-index={index}
                            aria-hidden={index !== currentIndex}>
                            {renderSlide(item, index, index === currentIndex)}
                        </article>
                    ))}
                </div>
            </div>

            {/* Progress Dots */}
            {showDots && (
                <div className={`${styles.carouselProgress} ${dotsClassName ?? ''}`}>
                    {items.map((item, index) => {
                        const isActive = index === currentIndex;
                        const onClick = () => {
                            const direction = index > currentIndex ? 'next' : 'prev';
                            goToSlide(index, direction);
                        };
                        return renderDot
                            ? renderDot(index, isActive, onClick)
                            : defaultRenderDot(index, isActive, onClick);
                    })}
                </div>
            )}
        </div>
    );
}

export default typedMemo(Carousel);
