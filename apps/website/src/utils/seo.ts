import type { Project } from '../data/projects';

/**
 * Generate JSON-LD structured data for a list of projects
 */
export function generateProjectsJsonLd(projects: Project[], siteUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: projects.map((project, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'CreativeWork',
                name: project.title,
                description: project.subtitle,
                image: new URL(project.image, siteUrl).href,
                url: new URL(`/showcase/${project.id}`, siteUrl).href,
                author: {
                    '@type': 'Person',
                    name: 'Thet Aung',
                },
                keywords: project.technologies.join(', '),
                about: project.category,
            },
        })),
    };
}

/**
 * Generate JSON-LD structured data for a single project
 */
export function generateProjectJsonLd(project: Project, siteUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        '@id': new URL(`/showcase/${project.id}`, siteUrl).href,
        name: project.title,
        alternateName: project.subtitle,
        description: project.description.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, ''),
        image: {
            '@type': 'ImageObject',
            url: new URL(project.image, siteUrl).href,
            caption: project.imageAlt,
        },
        url: new URL(`/showcase/${project.id}`, siteUrl).href,
        author: {
            '@type': 'Person',
            name: 'Thet Aung',
            url: siteUrl,
        },
        creator: {
            '@type': 'Person',
            name: 'Thet Aung',
        },
        keywords: project.technologies.join(', '),
        genre: project.category,
        inLanguage: 'en',
        timeRequired: project.timeline,
    };
}

/**
 * Generate BreadcrumbList JSON-LD
 */
export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@id': item.url,
                name: item.name,
            },
        })),
    };
}
