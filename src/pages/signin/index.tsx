import React, { useState } from 'react';
import { FaGithub, FaFacebookF } from 'react-icons/fa';
import { BsGoogle } from 'react-icons/bs';
import { AiFillLock } from 'react-icons/ai';
import { toast } from 'react-toastify';

import { getProviders, signIn, getSession, getCsrfToken, } from 'next-auth/react';

import styles from './signin.module.scss';

export default function SignIn({ providers, csrfToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { google, github, credentials, facebook } = providers;

  async function handleSignIn(e) {
    e.preventDefault();
    try {
      if (username && password) {
        signIn('credentials', {
          username,
          password
        });
      } else {
        setError('*Please insert the credentials to Sign In')
      }
    } catch (err) {
      toast.warning("Ops, There's something wrong to Sign In!");
    }
  }

  return (
    <div className={styles.signinContainer}>
      <div className={styles.signinForm}>
        <h1>Ignews Sign In</h1>
        <form onSubmit={handleSignIn} >
          <div className={styles.formContainer}>
            <input
              type='text'
              autoComplete='off'
              name='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
            />
            <input
              type='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
            <span>{error && error}</span>
          </div>
          <button type='submit' className={styles.signInButtonEmail} >
            <AiFillLock color="#eba415" />
            Sign in
          </button>
        </form>

        <div className={styles.buttonsContainer}>
          {google && (
            <button className={styles.signInButton} onClick={() => signIn('google')}>
              <BsGoogle color="#eba415" />
              Sign In Google
            </button>
          )}
          {github && (
            <button className={styles.signInButton} onClick={() => signIn('github')}>
              <FaGithub color="#eba415" />
              Sign In GitHub
            </button>
          )}
          {facebook && (
            <button className={styles.signInButton} onClick={() => signIn('facebook')}>
              <FaFacebookF color="#eba415" />
              Sign In Face
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (context) => {

  const { req, res } = context;
  const session = await getSession({ req });

  if (session && res && session.user) {
    res.writeHead(302, {
      Location: '/'
    });
    res.end();
    return {
      props: {}
    };
  }

  var providers = await getProviders();
  var csrfToken = await getCsrfToken();

  return {
    props: {
      session: null,
      providers,
      csrfToken,
    },
  }
}