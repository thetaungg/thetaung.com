import ArrowForwardIcon from '@/assets/icons/arrow-forward.svg?raw';
import BrushIcon from '@/assets/icons/brush.svg?raw';
import DashboardCustomizeIcon from '@/assets/icons/dashboard-customize.svg?raw';
import ExploreIcon from '@/assets/icons/explore.svg?raw';
import GithubIcon from '@/assets/icons/github.svg?raw';
import OpenInNewIcon from '@/assets/icons/open-in-new.svg?raw';
// import PaletteIcon from '@/assets/icons/palette.svg?raw';
import PlayCircleIcon from '@/assets/icons/play-circle.svg?raw';
// import PsychologyIcon from '@/assets/icons/psychology.svg?raw';
// import QuizIcon from '@/assets/icons/quiz.svg?raw';
import ScienceIcon from '@/assets/icons/science.svg?raw';
// import SearchIcon from '@/assets/icons/search.svg?raw';
import SpeedIcon from '@/assets/icons/speed.svg?raw';
import TableChartIcon from '@/assets/icons/table-chart.svg?raw';
import TuneIcon from '@/assets/icons/tune.svg?raw';
import VideocamIcon from '@/assets/icons/videocam.svg?raw';
import ButlerAppWebsiteImage from '@/assets/showcase/butlerapp/landing-hero.webp';
import ButlerAppWebsiteImageSm from '@/assets/showcase/butlerapp/landing-hero--sm.webp';
import MoleculesComponentsImage from '@/assets/showcase/molecules/molecules-components.webp';
import MoleculesComponentsImageSm from '@/assets/showcase/molecules/molecules-components--sm.webp';
import SayaLandingImage from '@/assets/showcase/saya/landing-1.webp';
import SayaLandingImageSm from '@/assets/showcase/saya/landing-1--sm.webp';
import TaylorDBAppEditorImage from '@/assets/showcase/taylordb/app-editor.webp';
import TaylorDBAppEditorImageSm from '@/assets/showcase/taylordb/app-editor--sm.webp';

export interface Feature {
    icon: string;
    title: string;
    description: string;
}

export interface Project {
    id: string; // URL slug for /showcase/:id
    title: string;
    subtitle: string;
    category: string;
    image: ImageMetadata;
    imageSm: ImageMetadata;
    imageAlt: string;
    technologies: string[];
    techColor: string;
    role: string;
    timeline: string;
    description: string;
    features: Feature[];
    cta: {
        primary: { label: string; href: string; icon: string };
        secondary?: { label: string; href: string; icon: string };
    };
}

export const showcaseIntro = {
    badge: 'Selected Case Studies',
    title: 'Recent\nWork',
    description:
        'Deep dives into projects where technical complexity meets intuitive design. Each application represents a challenge solved through the MERN stack.',
};

//     techColor: '#ea580c',

export const projects: Project[] = [
    {
        id: 'saya',
        title: 'SAYA - English Learning Platform',
        subtitle: 'English Learning Web App with courses, quizzes, live classes, and more.',
        category: 'Frontend',
        role: 'Frontend Engineer',
        timeline: '3+ Months',
        image: SayaLandingImage,
        imageSm: SayaLandingImageSm,
        imageAlt: 'SAYA Hero Section',
        technologies: ['Nextjs', 'React', 'Firebase'],
        techColor: '#F63C47',
        description: `This was my first contract project. I was hired by SAYA team to architect and build the frontend part of the new Website and the Web App.
        <br />
        I decided to use Next.js; Nextjs 12 was the latest version at the time and it was a great framework back then. Now, I wouldn't recommend it for new projects.`,
        features: [
            {
                icon: PlayCircleIcon,
                title: 'Course Viewer',
                description:
                    'Interactive course viewer with video player, progress tracking, bookmarks, quizzes, and more.',
            },
            {
                icon: VideocamIcon,
                title: 'Zoom Integration',
                description:
                    'Zoom SDK integration for live classes. Implemented with the help of nextjs API routes.',
            },
            // {
            //     icon: QuizIcon,
            //     title: 'Practice Test',
            //     description:
            //         'Interactive quizzes and assessments with instant feedback, progress tracking, fun ui, and adaptive difficulty levels.',
            // },
            // {
            //     icon: SpeedIcon,
            //     title: 'Performance & SEO',
            //     description: 'Achieved great performance and SEO.',
            // },
        ],
        cta: {
            primary: {
                label: 'Visit Website',
                href: 'https://saya.education',
                icon: OpenInNewIcon,
            },
            // secondary: { label: 'Read Case Study', href: '#', icon: 'description' },
        },
    },
    {
        id: 'react-native-molecules',
        title: 'React Native Molecules',
        subtitle:
            'Highly customizable, performant, React Native UI library with M3 Expressive Design',
        category: 'Frontend',
        role: 'Core Maintainer',
        timeline: '3+ Years',
        image: MoleculesComponentsImage,
        imageSm: MoleculesComponentsImageSm,
        imageAlt: 'React Native Molecules Components',
        technologies: ['React Native', 'Typescript', 'Unistyles'],
        techColor: '#6750a4',
        description: `The first project I worked on at Webbee was this one. We decided to build our own ui library to have more control over it and all the existing libraries were not meeting our needs. 
        <br />
        We focused on customizability, performance, native feel and ease of use. It was a great learning experience and I'm proud of the work we did. 
        <br />
        And I'm still actively working on it to publish it. I genuinely believe that this is the best react native ui library out there.`,
        features: [
            {
                icon: TuneIcon,
                title: 'Customizability',
                description:
                    'Highly customizable and replacable components with extensive theming options, variant props, and style overrides, etc.',
            },
            {
                icon: BrushIcon,
                title: 'Unistyles',
                description:
                    'Built with Unistyles for type-safe, high performant styling with dynamic themes and cool web features.',
            },
            // {
            //     icon: PaletteIcon,
            //     title: 'M3 Expressive',
            //     description:
            //         'Implements Material Design 3 Expressive design system with dynamic color schemes and modern UI patterns.',
            // },
            // {
            //     icon: SpeedIcon,
            //     title: 'Performance',
            //     description:
            //         'Optimized for 60fps animations with native feel, minimal re-renders, and efficient component architecture.',
            // },
        ],
        cta: {
            primary: {
                label: 'Visit Docs Site',
                href: 'https://molecules.taylordb.ai',
                icon: ArrowForwardIcon,
            },
            secondary: {
                label: 'View Code',
                href: 'https://github.com/webbeetechnologies/react-native-molecules',
                icon: GithubIcon,
            },
        },
    },
    {
        id: 'taylordb-ai',
        title: 'TaylorDB',
        subtitle: 'Revolutionary CRM builder that fits your business needs.',
        category: 'Web App',
        role: 'Senior Frontend Engineer and Cofounder',
        timeline: '3+ Years',
        image: TaylorDBAppEditorImage,
        imageSm: TaylorDBAppEditorImageSm,
        imageAlt: 'TaylorDB App Editor',
        technologies: ['React Native', 'Expo', 'React Native Molecules'],
        techColor: '#DA3D8F',
        description: `
        This project started off as Airtable inspired CRM. We've built Sync Engines, personalized DBs, and 60fps Table built with Canvas(and Skia on mobile).
        <br />
        And then we realized that a table is not good enough UX. So, we've built an app builder that allows customers to build their own CRM by using one of our many templates and customizing them with our AI agent that fits their needs.
        <br />
        I've learn a lot working on this and I'm proud of this project.
        `,
        features: [
            {
                icon: DashboardCustomizeIcon,
                title: 'CRM Builder',
                description:
                    'App builder that empowers customers to create custom CRMs using pre-built templates and AI-powered customization.',
            },
            {
                icon: TableChartIcon,
                title: 'Datagrid',
                description:
                    'Canvas-based 60fps performant table implementation that handles large datasets with smooth scrolling and interactions.',
            },
            // {
            //     icon: PsychologyIcon,
            //     title: 'AI Agent',
            //     description:
            //         'Intelligent agent that helps customers customize and tailor the CRM to fit their specific business needs.',
            // },
            // {
            //     icon: SpeedIcon,
            //     title: 'Performance',
            //     description:
            //         'Optimized rendering pipeline with virtualization, efficient state management, and lazy loading for instant responsiveness.',
            // },
        ],
        cta: {
            primary: {
                label: 'Visit Website',
                href: 'https://taylordb.ai/signup',
                icon: ExploreIcon,
            },
            // secondary: { label: 'View Code', href: '#', icon: 'github' },
        },
    },
    {
        id: 'butlerapp-de',
        title: 'Butlerapp Website',
        subtitle: "Website for Webbee GmbhH's Butlerapp software.",
        category: 'Website',
        role: 'Senior Frontend Engineer',
        timeline: '2+ Years',
        image: ButlerAppWebsiteImage,
        imageSm: ButlerAppWebsiteImageSm,
        imageAlt: 'Butlerapp Website Hero Section',
        technologies: ['Astro', 'React', 'SCSS'],
        techColor: '#00D0AB',
        description: `This is an interesting story as well. A few months after I joined Webbee, I saw this website and it was built with Wordpress at the time.
        <br />
        I noticed that it was very slow; 30 sec for the first contentful paint which is unacceptable for a website. So, I pitched the idea to the team to rebuild the website with Astro and a few months later, the website was loading under 1 sec.
        `,
        features: [
            {
                icon: SpeedIcon,
                title: 'Performance',
                description: 'Achieved under 1 sec for the first contentful paint',
            },
            {
                icon: ScienceIcon,
                title: 'Split Testing',
                description:
                    'Achitected a custom scalable and predictable split testing flow with git, nginx and lua.',
            },
            // {
            //     icon: SearchIcon,
            //     title: 'SEO',
            //     description:
            //         'Structured data, meta-tag management, and server-side rendering to maximize organic search visibility.',
            // },
        ],
        cta: {
            primary: {
                label: 'Visit Website',
                href: 'https://butlerapp.de',
                icon: ExploreIcon,
            },
            // secondary: { label: 'Read Case Study', href: '#', icon: 'github' },
        },
    },
];
