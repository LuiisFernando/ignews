import axios from 'axios';

export const externalApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ECURSO_URL
});