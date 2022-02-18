import { query as q } from 'faunadb';
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

import { fauna } from '../../../services/fauna';
import { externalApi } from '../../../services/externalApi';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "nodeCredential",
      credentials: {
        username: { label: "Usuário", type: "text", placeholder: "" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credential, req) {
        const response = await externalApi.post('/auth', { credential });

        const { user } = response.data;

        if (user) {
          return user;
        } else {
          return null;
        }
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    })
  ],
  theme: {
    colorScheme: 'light'
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const { email, name } = user;

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email, name } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(email)
              )
            )
          )
        );
        return true;
      } catch {
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      return Promise.resolve(baseUrl);

    },
    async jwt({ token, user, account, profile, isNewUser }) {
      token.userRole = "admin"

      return token
    },
    async session({ session, user, token }) {
      return session
    },
  },
  pages: {
    signIn: '/signin',
    error: '/signin/signin-error'
  }
})