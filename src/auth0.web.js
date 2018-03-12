// @flow

import decode from 'jwt-decode';
import Auth0Lock from 'auth0-lock';

const KEY = '!profile';

export type Profile = {
  nickname: string,
  name: string,
  picture: string,
  updated_at: string,
  email: string,
  email_verified: boolean,
  iss: string,
  sub: string,
  aud: string,
  iat: number,
  exp: number,
  nonce: string,
  credentials: {
    idToken: string,
    state: string
  }
};

export const getUserInfo = async (): Promise<Profile | void> => {
  const p = localStorage.getItem(KEY);
  return p ? JSON.parse(p) : undefined;
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem(KEY);
};

export const authorize = async (): Promise<Profile> => {
  const lock = new Auth0Lock(
    'YbAHcczyP672C0uHggH2a7BHcuFiLYTt',
    'olebedev.eu.auth0.com',
    {
      autoclose: true,
      theme: {
        logo: 'https://i.imgur.com/9wmB3yv.jpg',
        primaryColor: '#333'
      },
      auth: {
        audience: 'https://olebedev.eu.auth0.com/userinfo',
        redirect: false,
        responseType: 'id_token',
        params: {
          scope: 'openid profile email picture' // Learn about scopes: https://auth0.com/docs/scopes
        }
      }
    }
  );

  // Listening for the authenticated event
  setTimeout(lock.show.bind(lock), 0);
  const credentials = await new Promise(r => lock.on('authenticated', r));

  const p = {
    credentials,
    ...decode(credentials.idToken)
  };

  localStorage.setItem(KEY, JSON.stringify(p));
  return p;
};
