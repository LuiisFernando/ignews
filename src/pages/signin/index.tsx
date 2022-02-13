import React, { useState } from 'react';
import { NextPageContext, GetServerSideProps } from 'next';

import { getProviders, signIn, getSession, getCsrfToken, } from 'next-auth/react';

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
      {
        Object['values'](providers).map((provider: any, index) => {
          return (
            provider.id === 'credentials' ? (
              <div key={index}>
                <form onSubmit={handleSignIn}>
                  <div className='form-container'>
                    <div className='control'>
                      <input type='text' name='username' value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className='control'>
                      <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className='button-container'>
                      <button type='submit'>
                        Login
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <button key={index} onClick={() => signIn('github')}>logar com git</button>
            )
          );
        })
      }
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