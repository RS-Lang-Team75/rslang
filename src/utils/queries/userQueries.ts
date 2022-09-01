import axios from 'axios';

import { SERVER_URL } from './url';

import { UserCredentials } from '@/types/userTypes';

export interface UserResponse {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

const axiosConfig = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};

export const createUser = async (user: UserCredentials): Promise<UserResponse> => {
  const response = await axios.post<UserResponse>(
    `${SERVER_URL}/users`,
    user,
    axiosConfig);
  return response.data;
};

export const signIn =async (user: UserCredentials): Promise<UserResponse> => {
  const response = await axios.post<UserResponse>(
    `${SERVER_URL}/signin`,
    user,
    axiosConfig);
  return response.data;
};
