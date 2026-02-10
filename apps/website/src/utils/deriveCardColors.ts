import { colord } from 'colord';

export interface CardColorVars {
    '--pc-rgb': string;
    '--pc-color': string;
    '--pc-light': string;
    '--pc-dark': string;
    '--pc-number-end-rgb': string;
}

function toRgbTriplet(hex: string): string {
    const { r, g, b } = colord(hex).toRgb();
    return `${r}, ${g}, ${b}`;
}

export function deriveCardColors(hex: string): CardColorVars {
    const base = colord(hex);

    return {
        '--pc-rgb': toRgbTriplet(hex),
        '--pc-color': base.toHex(),
        '--pc-light': base.lighten(0.25).toHex(),
        '--pc-dark': base.darken(0.08).toHex(),
        '--pc-number-end-rgb': toRgbTriplet(base.lighten(0.1).toHex()),
    };
}
