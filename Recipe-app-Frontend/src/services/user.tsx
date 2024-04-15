import { CredentialResponse } from '@react-oauth/google';
import axios from 'axios';

export interface IUser {
  email: string;
  password?: string;
  username: string;
  imgURL: string;
  id: string;
  accessToken: string; // Now using 'accessToken' without colon
  refreshToken: string; // Now using 'refreshToken' without colon
  posts?: any[]; // Assuming posts is an array
}

export const googleSignIn = async (credentialResponse: CredentialResponse): Promise<IUser> => {
  try {
      console.log('googleSignIn..');
      const response = await axios.post('https://193.106.55.205/auth/google', { credentialResponse });
      console.log("the response is:", response);
      
      // Check if the required properties exist in the response data
      if (
          response.data['email:'] === undefined ||
          response.data['username:'] === undefined ||
          response.data['imgURL:'] === undefined ||
          response.data['user id:'] === undefined ||
          response.data['access token:'] === undefined ||
          response.data['refresh token:'] === undefined
      ) {
          throw new Error('Response data is incomplete');
      }

      const userData: IUser = {
          email: response.data['email:'],
          username: response.data['username:'],
          imgURL: response.data['imgURL:'],
          id: response.data['user id:'],
          accessToken: response.data['access token:'],
          refreshToken: response.data['refresh token:'],
          posts: response.data.posts // Assuming posts is an array
      };

      // Store data in localStorage
      localStorage.setItem('accessToken', userData.accessToken);
      localStorage.setItem('refreshToken', userData.refreshToken);
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('userName', userData.username);
      localStorage.setItem('imgURL', userData.imgURL);
      localStorage.setItem('email', userData.email);
      localStorage.setItem('posts', JSON.stringify(userData.posts));

      return userData; // Resolve the promise with the user data
  } catch (error) {
      console.error('Google sign in failed', error);
      throw error; // Throw the error to be caught by the caller
  }
};

 

 