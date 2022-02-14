import { query as q } from 'faunadb';
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

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
        console.log('caiu caqui', req.body);


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
        url: "https://ignews-gamma-blue.vercel.app/api/auth/callback/google",
      }
    }),
  ],
  theme: {
    colorScheme: 'light'
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        console.log('google')
        return profile.email_verified && profile.email.endsWith("@example.com")
      }

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
    // signIn: '/signin',
  }
})