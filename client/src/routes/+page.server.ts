
import {auth, refreshToken} from '$lib/auth.js'
import {LoginUserDocument} from '../generated/graphql'
import { setContextClient, getContextClient } from '@urql/svelte';
import { fail, redirect } from '@sveltejs/kit'
import type { Action, Actions, PageServerLoad } from './$types'
import {urqlClient} from '$lib/urql'
import {error} from '@sveltejs/kit'
import { onMount } from 'svelte';
let autherror;


onMount(async () => {
  setContextClient(urqlClient)
  let client = getContextClient();
})
const login: Action = async ({cookies, request}, client) => {
  const data = await request.formData()
  const username = data.get('username')
  const password = data.get('password')
  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    !username ||
    !password
    ) {
      return fail(400, { invalid: true })
    }
    
    
    client
    ?.mutation( LoginUserDocument, {username, password})
    .toPromise()
    .then((result) => {
      console.log(username, password);
      console.log(result);
      const {token} = result.data.loginUser
      if (token) {
        localStorage.setItem('token', token)
        console.log(result.data.loginUser.user.isAdmin);
        auth.set({isAdmin: result.data.loginUser.user.isAdmin, isLoggedIn: true})
        refreshToken.set({isAdmin: result.data.loginUser.refreshToken})
        cookies.set('refreshToken', result.data?.loginUser.refreshToken, {
          // send cookie for every page
          path: '/',
          // server side only cookie so you can't use `document.cookie`
          httpOnly: true,
          // only requests from same site can send cookies
          // https://developer.mozilla.org/en-US/docs/Glossary/CSRF
          sameSite: 'strict',
          // only sent over HTTPS in production
          secure: process.env.NODE_ENV === 'production',
          // set cookie to expire after a month
          maxAge: 60 * 60 * 24 * 30,
        })
        
        // redirect the user
        throw redirect(302, '/dashboard')
        
        //  goto('/dashboard');
      }})
      .catch((err) => {
        console.error(err.message)
        autherror = 'Invalid Username or Password';
        return error (401, autherror)
      })
      
    }
    
    export const actions: Actions = { login }
    
    export const load: PageServerLoad = async () => {

      
    }
    