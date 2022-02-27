import { GetStaticProps } from 'next';
import Head from 'next/head';
import * as Prismic from '@prismicio/client';

import styles from './styles.module.scss';
import { createClient } from '../../services/prismic';

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Creating a Monorepo with Lerna & Yarn  Workspaces</strong>
            <p>In this guide, you will learn how to create a Monorepo to manage multiple packages with shared</p>
          </a>
          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Creating a Monorepo with Lerna & Yarn  Workspaces</strong>
            <p>In this guide, you will learn how to create a Monorepo to manage multiple packages with shared</p>
          </a>
          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Creating a Monorepo with Lerna & Yarn  Workspaces</strong>
            <p>In this guide, you will learn how to create a Monorepo to manage multiple packages with shared</p>
          </a>
          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Creating a Monorepo with Lerna & Yarn  Workspaces</strong>
            <p>In this guide, you will learn how to create a Monorepo to manage multiple packages with shared</p>
          </a>
        </div>
      </main>
    </>
  );
}

export const getStaticProps = async (context) => {
  const { req, res } = context;
  var prismic = createClient(context);

  const response = await prismic.query([
    Prismic.predicate.at('document.type', 'post')
  ], {
    fetch: ['post.title', 'post.content'],
    pageSize: 100
  });

  console.log(response);

  return {
    props: {}
  }
};