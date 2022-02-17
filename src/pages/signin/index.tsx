import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { FaGithub } from 'react-icons/fa';
import { BsGoogle } from 'react-icons/bs';
import { AiFillLock } from 'react-icons/ai';


import { getProviders, signIn, getSession, getCsrfToken, } from 'next-auth/react';

import styles from './signin.module.scss';

export default function SignIn({ providers, csrfToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { google, github, credentials } = providers;

  async function handleSignIn(e) {
    e.preventDefault();
    try {
      signIn('credentials', {
        username,
        password
      });
    } catch (err) {
      console.log('erro ao logar >> ', err.message);
    }
  }

  return (
    <div className={styles.signinContainer}>
      <div className={styles.signinForm}>
        <form onSubmit={handleSignIn} >
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
          <button type='submit' className={styles.signInButton} >
            <AiFillLock color="#eba415" />
            Login with E-mail
          </button>
        </form>

        <div className={styles.buttonsContainer}>
          {google && (
            <button className={styles.signInButton} onClick={() => signIn('google')}>
              <BsGoogle color="#eba415" />
              Sign In with Google
            </button>
          )}
          {github && (
            <button className={styles.signInButton} onClick={() => signIn('github')}>
              <FaGithub color="#eba415" />
              Sign In with GitHub
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


export const getServerSideProps: GetServerSideProps = async (context) => {

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
      csrfToken
    }
  }
}