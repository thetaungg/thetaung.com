import type { ISourceOptions } from '@tsparticles/engine';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useEffect, useRef, useState } from 'react';

const options: ISourceOptions = {
    fullScreen: {
        enable: false, // Disable fullscreen mode - render in container only
    },
    background: {
        color: {
            value: 'transparent',
        },
    },
    fpsLimit: 60,
    interactivity: {
        events: {
            onHover: {
                enable: true,
                mode: 'repulse',
            },
        },
        modes: {
            repulse: {
                distance: 150,
                duration: 0.4,
                speed: 1,
            },
        },
    },
    particles: {
        color: {
            value: ['#3b82f6', '#60a5fa', '#93c5fd', '#94a3b8'],
        },
        links: {
            enable: true,
            color: '#93c5fd',
            distance: 120,
            opacity: 0.3,
            width: 1,
        },
        move: {
            enable: true,
            speed: 1.2,
            direction: 'none' as const,
            random: true,
            straight: false,
            outModes: {
                default: 'bounce' as const,
            },
            attract: {
                enable: true,
                rotate: { x: 600, y: 1200 },
            },
        },
        number: {
            value: 150,
            density: {
                enable: true,
                width: 1920,
                height: 1080,
            },
        },
        opacity: {
            value: { min: 0.3, max: 0.8 },
        },
        shape: {
            type: 'circle',
        },
        size: {
            value: { min: 1, max: 4 },
        },
    },
    detectRetina: true,
};

export default function ParticlesBackground() {
    const [init, setInit] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        initParticlesEngine(async engine => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    if (!init) return null;

    return (
        <div ref={containerRef} style={containerStyle}>
            <Particles id="tsparticles" options={options} style={particlesStyle} />
        </div>
    );
}

const containerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    overflow: 'hidden',
    pointerEvents: 'none',
};

const particlesStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'auto',
};
