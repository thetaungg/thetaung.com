import type { ReactNode, CSSProperties, RefObject } from "react";
import type { CarouselAnimationConfig, OnSlideChangeCallback } from "@/hooks/useCarousel";

export interface CarouselItem {
  id: string | number;
}

export interface CarouselProps<T extends CarouselItem> {
  items: T[];
  renderSlide: (item: T, index: number, isActive: boolean) => ReactNode;

  // Animation configuration
  animationConfig?: Partial<CarouselAnimationConfig>;

  // Navigation options
  enableKeyboardNav?: boolean;
  enableTouchNav?: boolean;
  swipeThreshold?: number;

  // UI options
  showCounter?: boolean;
  showDots?: boolean;
  showArrows?: boolean;

  // Custom render props for UI elements
  renderCounter?: (
    current: number,
    total: number,
    counterRef: RefObject<HTMLSpanElement | null>,
  ) => ReactNode;
  renderDot?: (
    index: number,
    isActive: boolean,
    onClick: () => void,
  ) => ReactNode;
  renderArrows?: (prev: () => void, next: () => void) => ReactNode;

  // Lifecycle callback — add custom animations to the slide transition timeline
  onSlideChange?: OnSlideChangeCallback;

  // Styling
  className?: string;
  slideClassName?: string;
  viewportClassName?: string;
  trackClassName?: string;
  controlsClassName?: string;
  dotsClassName?: string;
  style?: CSSProperties;

  // Accessibility
  ariaLabel?: string;
  slideAriaLabel?: (item: T, index: number) => string;
}
