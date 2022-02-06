import styles from './styles.module.scss';

interface SubscrieButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscrieButtonProps) {
    return (
        <button
            type="button"
            className={styles.subscribeButton}
        >
            Subscribe now
        </button>
    );
}