import Link from 'next/link';
import { SignInButton } from '../SignInButton';
import styles from './styles.module.scss';
import { useRouter } from 'next/router'

export function Header() {
    const router = useRouter()
    const rota = router.pathname.replace('/', '');
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="ig.news" />
                <nav>
                    <Link href="/">
                        <a className={rota === '' ? styles.active : ''} href="">Home</a>
                    </Link>
                    <Link href="/Posts">
                        <a className={rota === '/Posts' ? styles.active : ''}>Posts</a>
                    </Link>
                    <Link href="/SignIn">
                        <a className={rota === 'Signin' ? styles.active : ''}>Login</a>
                    </Link>
                </nav>

                <SignInButton />
            </div>
        </header>
    );
}