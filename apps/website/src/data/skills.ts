import astroIcon from '../assets/icons/astro.svg';
import awsIcon from '../assets/icons/aws.svg';
import bunIcon from '../assets/icons/bun.svg';
import graphqlIcon from '../assets/icons/graphql.svg';
import jetpackcomposeIcon from '../assets/icons/jetpackcompose.svg';
import mongodbIcon from '../assets/icons/mongodb.svg';
import nestjsIcon from '../assets/icons/nestjs.svg';
import nextjsIcon from '../assets/icons/nextjs.svg';
import nodejsIcon from '../assets/icons/nodejs.svg';
import postgresqlIcon from '../assets/icons/postgresql.svg';
import prismaIcon from '../assets/icons/prisma.svg';
import reactIcon from '../assets/icons/react.svg';
import sassIcon from '../assets/icons/sass.svg';
import swiftuiIcon from '../assets/icons/swiftui.svg';
import trpcIcon from '../assets/icons/trpc.svg';
import typescriptIcon from '../assets/icons/typescript.svg';
import wasmIcon from '../assets/icons/wasm.svg';

export interface Skill {
    name: string;
    icon: ImageMetadata;
    color: string;
    size: 'sm' | 'md' | 'lg';
    animation: 'slow' | 'medium' | 'fast';
}

export const skillsData = {
    title: 'Skills & Technologies',
    description:
        'An expanding universe of tools and technologies I leverage to build robust, scalable applications.',
    rows: [
        // Row 1 — 7 items
        [
            { name: 'Prisma', icon: prismaIcon, color: 'slate', size: 'sm', animation: 'slow' },
            { name: 'NestJS', icon: nestjsIcon, color: 'pink', size: 'md', animation: 'slow' },
            { name: 'Next.js', icon: nextjsIcon, color: 'slate', size: 'lg', animation: 'medium' },
            { name: 'React', icon: reactIcon, color: 'blue', size: 'md', animation: 'medium' },
            {
                name: 'TypeScript',
                icon: typescriptIcon,
                color: 'blue',
                size: 'lg',
                animation: 'medium',
            },
            { name: 'tRPC', icon: trpcIcon, color: 'blue', size: 'sm', animation: 'medium' },
            { name: 'Bun', icon: bunIcon, color: 'amber', size: 'md', animation: 'medium' },
        ],
        // Row 2 — 6 items
        [
            { name: 'Astro', icon: astroIcon, color: 'orange', size: 'lg', animation: 'fast' },
            { name: 'AWS', icon: awsIcon, color: 'orange', size: 'md', animation: 'fast' },
            { name: 'React Native', icon: reactIcon, color: 'cyan', size: 'lg', animation: 'fast' },
            { name: 'GraphQL', icon: graphqlIcon, color: 'pink', size: 'md', animation: 'fast' },
            {
                name: 'PostgreSQL',
                icon: postgresqlIcon,
                color: 'blue',
                size: 'md',
                animation: 'medium',
            },
            { name: 'SCSS', icon: sassIcon, color: 'pink', size: 'lg', animation: 'fast' },
        ],
        // Row 3 — 5 items
        [
            {
                name: 'Jetpack Compose',
                icon: jetpackcomposeIcon,
                color: 'green',
                size: 'sm',
                animation: 'fast',
            },
            { name: 'SwiftUI', icon: swiftuiIcon, color: 'blue', size: 'md', animation: 'slow' },
            { name: 'Node.js', icon: nodejsIcon, color: 'green', size: 'lg', animation: 'fast' },
            { name: 'WASM', icon: wasmIcon, color: 'purple', size: 'sm', animation: 'medium' },
            { name: 'MongoDB', icon: mongodbIcon, color: 'green', size: 'md', animation: 'slow' },
        ],
    ] satisfies Skill[][],
};
