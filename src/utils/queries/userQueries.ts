import axios from 'axios';

import { setAxiosConfig } from './headers';
import { SERVER_URL } from './url';

import { UserCredentials } from '@/types/userTypes';

export interface UserResponse {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export const createUser = async (user: UserCredentials): Promise<UserResponse> => {
  const response = await axios.post<UserResponse>(
    `${SERVER_URL}/users`,
    user,
    setAxiosConfig());
  return response.data;
};

export const signIn =async (user: UserCredentials): Promise<UserResponse> => {
  const response = await axios.post<UserResponse>(
    `${SERVER_URL}/signin`,
    user,
    setAxiosConfig());
  return response.data;
};
