import { FiX } from 'react-icons/fi';
import { FcGoogle } from "react-icons/fc";
import { BsGoogle } from "react-icons/bs";

import { signIn, signOut, useSession } from 'next-auth/react';

import styles from './styles.module.scss';

export function SiginInGoogleButton() {
  const { data: session } = useSession();

  return session ? (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signOut()}
    >
      <FcGoogle />
      {session.user.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signIn('github')}
    >
      <BsGoogle color="#eba415" />
      Sign in with Google
    </button>
  )
}