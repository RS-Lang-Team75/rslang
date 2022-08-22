import axios from 'axios';

import { UserCredentials } from '@/types/userTypes';

const axiosConfig = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};

export const createUser = async (user: UserCredentials): Promise<UserCredentials> => {
  const response = await axios.post<UserCredentials>(
    'https://rslang-team75.herokuapp.com/users',
    user,
    axiosConfig);
  return response.data;
};

export const signIn =async (user: UserCredentials): Promise<UserCredentials> => {
  const response = await axios.post<UserCredentials>(
    'https://rslang-team75.herokuapp.com/signin',
    user,
    axiosConfig);
  return response.data;
};
