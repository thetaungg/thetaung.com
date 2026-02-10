import Me from '../assets/me.png';

export const siteData = {
    title: 'Thet Aung - Senior Software Engineer',
    description:
        'Senior Software Engineer crafting scalable, human-centric web applications with clean code and thoughtful design.',
    author: 'Thet Aung',
    avatar: Me.src,
};

export const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Work', href: '#showcase' },
];

export const GITHUB_URL = 'https://github.com/thetaungg';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/thetaung-dev';

export const CURRENT_COMPANY = {
    name: 'Webbee GmbH',
    url: 'https://web-bee.org',
};

export const footerData = {
    name: 'Thet Aung',
    copyright: `© ${new Date().getFullYear()}. Crafted with code and creativity.`,
    socialLinks: [
        { icon: 'fab fa-github', href: GITHUB_URL, hoverColor: 'slate' },
        {
            icon: 'fab fa-linkedin',
            href: LINKEDIN_URL,
            hoverColor: 'blue',
        },
        // { icon: 'fab fa-stack-overflow', href: '#', hoverColor: 'orange' },
        { icon: 'far fa-envelope', href: 'mailto:thetaung.dev@gmail.com', hoverColor: 'red' },
    ],
};
