import { newToken, refreshToken } from '$lib/auth.js';
import { LoginUserDocument } from '../generated/graphql';
import { fail, redirect } from '@sveltejs/kit';
import type { Action, Actions, PageServerLoad } from './$types';
import { Client, mapExchange, cacheExchange, fetchExchange } from '@urql/svelte';


const login: Action = async ({ cookies, request }) => {
  const client = new Client({
    exchanges: [
      mapExchange({
        onError(error) {
          console.error(error);

        },
      }),
      cacheExchange,
      fetchExchange,
    ],
    url: 'http://localhost:5555', // Update with your GraphQL server URL
    fetchOptions: () => {
      // const token = getToken();
      const refreshToken = cookies.get('refreshToken');
      const token = cookies.get('token');
      return {
        headers: {
          token,
          refreshToken
        },
        credentials: 'include',
      };
    },
    requestPolicy: 'cache-and-network',
  });

  const loginUser = async (username, password) => {
    const result = await client.mutation(LoginUserDocument, { username, password }).toPromise();
    return result;
  };

  const formData = await request.formData();
  const username = formData.get('username');
  const password = formData.get('password');

  if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
    return fail(400, { invalid: true });
  }

    const result = await loginUser(username, password);

    if (result.data) {
      const { loginUser } = result.data;
      if (loginUser) {
        const { token, refreshToken, user } = loginUser;

        if (token) {
          cookies.set('refreshToken', refreshToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            // secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30,
          });
          cookies.set('token', token, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            // secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30,
          });
          cookies.set('isAdmin', user.isAdmin, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            // secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30,
          });
          cookies.set('token', token, {
            path: '/',
            httpOnly: true,
            sameSite: 'Lax',
            secure: false,
            maxAge: 60 * 60 * 24,
          });
          cookies.set('isAdmin', user.isAdmin, {
            path: '/',
            httpOnly: true,
            sameSite: 'Lax',
            secure: false,
            maxAge: 60 * 60 * 24,
          })

          // Return an object indicating a successful login
          throw redirect(302, '/dashboard');
          
        } else {
          // Handle the case when token is undefined
          console.error('Token is undefined');
        }
      } else {
        // Handle the case when loginUser is undefined
        console.error('loginUser is undefined');
      }
    }
  
};

export const actions: Actions = { login };

export const load: PageServerLoad = async () => {};
