import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';


import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscrieButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscrieButtonProps) {

    const { data: session } = useSession();
    const router = useRouter();

    async function handleSubscribe() {
        if (!session) {
            toast.warning('Para fazer o subscribe é necessário fazer o login primeiro.');
            return;
        }

        if (session.activeSubscription) {
            router.push('/posts');
            return;
        }

        try {
            const response = await api.post('/subscribe');

            const { sessionId } = response.data;
            const stripe = await getStripeJs();

            await stripe.redirectToCheckout({ sessionId });
        } catch (err) {
            toast.warning("Ocorreu um erro ao efetuar o subscribe!");
        }
    }

    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    );
}