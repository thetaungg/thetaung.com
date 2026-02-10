import { type CSSProperties, useMemo } from 'react';

import ArrowForwardIcon from '@/assets/icons/arrow-forward.svg?react';

import type { Project } from '../../data/projects';
import { deriveCardColors } from '../../utils/deriveCardColors';
import styles from './ProjectCard.module.scss';

interface ProjectCardProps {
    project: Project;
    index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    const colorVars = useMemo(() => deriveCardColors(project.techColor), [project.techColor]);

    return (
        <div className={styles.projectCardInner} style={colorVars as CSSProperties}>
            {/* Image Section */}
            <a href={`/showcase/${project.id}`} className={styles.slideImageWrapper}>
                <img
                    src={project.image}
                    alt={project.imageAlt}
                    className={styles.slideImage}
                    loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className={styles.slideImageOverlay} />
                <div className={styles.slideImageContent}>
                    <span className={styles.slideCategory}>{project.category}</span>
                    <div className={styles.slideImageMeta}>
                        <span>{project.role}</span>
                        <span>{project.timeline}</span>
                    </div>
                </div>
            </a>

            {/* Content Section */}
            <div className={styles.slideContent}>
                <div className={styles.slideHeader}>
                    <h3 className={styles.slideTitle}>{project.title}</h3>
                    <p className={styles.slideSubtitle}>{project.subtitle}</p>
                </div>

                <div className={styles.slideTech}>
                    {project.technologies.map(tech => (
                        <span key={tech} className={styles.slideTechTag}>
                            {tech}
                        </span>
                    ))}
                </div>

                <p
                    className={styles.slideDescription}
                    dangerouslySetInnerHTML={{ __html: project.description }}
                />

                <div className={styles.slideFeatures}>
                    {project.features.slice(0, 2).map(feature => (
                        <div
                            key={feature.title}
                            className={styles.slideFeature}
                            title={feature.description}>
                            <span
                                className={styles.featureIcon}
                                dangerouslySetInnerHTML={{ __html: feature.icon }}
                            />
                            <span className={styles.featureTitle}>{feature.title}</span>
                        </div>
                    ))}
                </div>

                <div className={styles.slideCta}>
                    <a
                        href={`/showcase/${project.id}`}
                        className={`${styles.slideBtn} ${styles.slideBtnPrimary}`}>
                        {project.cta.primary.label}
                        <ArrowForwardIcon />
                    </a>
                    {project.cta.secondary && (
                        <a
                            href={project.cta.secondary.href}
                            className={`${styles.slideBtn} ${styles.slideBtnSecondary}`}>
                            {project.cta.secondary.label}
                            {
                                <span
                                    className={styles.svgIcon}
                                    dangerouslySetInnerHTML={{
                                        __html: project.cta.secondary.icon,
                                    }}
                                />
                            }
                        </a>
                    )}
                </div>
            </div>

            {/* Slide Number */}
            {/* <div className={styles.slideNumber}>
                <span>{String(index + 1).padStart(2, '0')}</span>
            </div> */}
        </div>
    );
}
