import React, { useState } from 'react';
import { NextPageContext, GetServerSideProps } from 'next';
import { FaGithub } from 'react-icons/fa';
import { BsGoogle } from 'react-icons/bs';

import { getProviders, signIn, getSession, getCsrfToken, } from 'next-auth/react';

import styles from './signin.module.scss';

export default function SignIn({ providers, csrfToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
    <>
      <div className={styles.signinContainer}>
        {
          Object['values'](providers).map((provider: any, index) => {
            return (
              <div key={index}>
                {provider.id === 'credentials' && (
                  <form onSubmit={handleSignIn} >
                    <div className='form-container'>
                      <div className='control'>
                        <input type='text' name='username' value={username} onChange={(e) => setUsername(e.target.value)} />
                      </div>
                      <div className='control'>
                        <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                      </div>
                      <div className='button-container'>
                        <button type='submit' className={styles.signInButton} >
                          Login with E-mail
                        </button>
                      </div>
                    </div>
                  </form>
                )}
                <div className={styles.buttonsContainer}>
                  {provider.id === 'github' && (
                    <button className={styles.signInButton} onClick={() => signIn('github')}>
                      <FaGithub color="#eba415" />
                      Sign In with GitHub
                    </button>
                  )}
                  {provider.id === 'google' && (
                    <button className={styles.signInButton} onClick={() => signIn('github')}>
                      <BsGoogle color="#eba415" />
                      Sign In with Google
                    </button>
                  )}
                </div>
              </div>
            );
          })
        }
      </div>
    </>


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