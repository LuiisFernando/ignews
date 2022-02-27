
import * as prismic from '@prismicio/client'
import { enableAutoPreviews } from '@prismicio/next'

const repositoryName = 'ignewsluis';
const endpoint = prismic.getEndpoint(repositoryName)

export const createClient = ({ req }) => {
  const client = prismic.createClient(endpoint, { accessToken: process.env.PRISMIC_ACESS_TOKEN })

  enableAutoPreviews({ client, req })

  return client
}