export interface ExperienceItem {
    title: string;
    company: string;
    period: string;
    description: string;
    isCurrent: boolean;
    type?: 'founder' | 'employment';
}

export interface Education {
    degree: string;
    institution: string;
    period: string;
    description?: string;
}

export const experienceData = {
    title: 'Experience &\nEducation',
    description: 'A timeline of my career and my never ending education.',
    experiences: [
        {
            title: 'Senior Frontend Engineer & Cofounder',
            company: 'Webbee GmbH',
            period: 'Aug, 2022 — Present',
            description:
                "Leading the frontend of the company's flagship SaaS product; TaylorDB. Built React Native Molecules library and highly performant canvas-based datatable library.",
            isCurrent: true,
            type: 'founder',
        },
        {
            title: 'Frontend Developer',
            company: 'Creatella - Venture Builder',
            period: 'Nov, 2021 — Nov, 2022',
            description:
                'This is a software house company.Built and worked on multiple client projects. Learned React Native and built my first React Native app which is called Solodou (French learning app).',
            isCurrent: false,
        },
        {
            title: 'Frontend Developer & Frontend Lead',
            company: 'Nuzay Myanmar',
            period: 'Feb, 2020 — Nov, 2021',
            description:
                "First full-time job. Started as mid-level developer. Learned Vue.js, Nuxt.js, Nuxt.js, AWS and more on the job. Built multiple SaaS products(Udemy like project called Educate Myanmar and Booking.com like project) and web applications. But the company, unfortunately, wasn't sustainable because of Covid and Myanmar Coup forcing me to move on.",
            isCurrent: false,
        },
    ] satisfies ExperienceItem[],
    education: {
        degree: 'Self Taught',
        institution: 'Myself',
        period: 'Since always',
        description: `I've been learing and building things since I know how to use a computer. Couldn't (and don't want to) complete my degree because the education system sucks, and COVID + the coup conveniently happened which made a perfect excuse for me :)
            Proud self-learner.`,
    } satisfies Education,
};
