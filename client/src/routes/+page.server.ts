import { newToken, refreshToken } from '$lib/auth.js';
import { LoginUserDocument } from '../generated/graphql';
import { fail, redirect } from '@sveltejs/kit';
import type { Action, Actions, PageServerLoad } from './$types';
import { browser } from '$app/environment';
import { Client, mapExchange, cacheExchange, fetchExchange } from '@urql/svelte';

// const query = gql`
//   mutation LoginUser($username: String!, $password: String!) {
//     loginUser(username: $username, password: $password) {
//       token
//       refreshToken
//       user {
//         id
//         email
//         isAdmin
//         name
//         username
//       }
//     }
//   }
// `;

// const getToken = () => {
//   if (browser) {
//     return localStorage.getItem('token') || '';
//   }
//   return '';
// };

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
      const refreshTokenValue = cookies.get('refreshToken');
      return {
        headers: {
          authorization: newToken ? `Bearer ${newToken}` : '',
          refreshToken: refreshTokenValue || '',
          // timeout: 15000,
        },
      };
    },
    // credentials: 'include',
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

  try {
    const result = await loginUser(username, password);

    if (result.data) {
      const { loginUser } = result.data;
      if (loginUser) {
        const { token, refreshToken: newRefreshToken, user } = loginUser;

        if (token) {
          newToken.set(token)
          refreshToken.set({ isAdmin: loginUser.isAdmin });
          cookies.set('refreshToken', newRefreshToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30,
          });

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
  } catch (error) {
    // Handle other errors during login
    console.error('An error occurred during login:', error);

    // Return an error response
    return {
      status: 500, // Internal Server Error
      error: 'An error occurred during login',
    };
  }
};

export const actions: Actions = { login };

export const load: PageServerLoad = async () => {};
