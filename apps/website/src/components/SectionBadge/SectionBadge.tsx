import styles from './SectionBadge.module.scss';

interface SectionBadgeProps {
    text: string;
    color?: 'blue' | 'purple' | 'green' | 'orange' | 'slate';
    variant?: 'filled' | 'outline';
}

const colorStyles: Record<string, string> = {
    blue: styles.blue,
    purple: styles.purple,
    green: styles.green,
    orange: styles.orange,
    slate: styles.slate,
};

export default function SectionBadge({
    text,
    color = 'blue',
    variant = 'filled',
}: SectionBadgeProps) {
    const colorClass = colorStyles[color] || colorStyles.blue;
    const variantClass = variant === 'outline' ? styles.outline : '';

    return (
        <div className={`${styles.sectionBadge} ${colorClass} ${variantClass}`}>
            <span className={styles.dot} />
            <span className={styles.text}>{text}</span>
        </div>
    );
}
