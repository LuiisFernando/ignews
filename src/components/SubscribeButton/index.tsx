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
            toast.warning('To subscribe you need to login first.');
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
            toast.warning("Ops, There's something wrong to subscribe!");
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