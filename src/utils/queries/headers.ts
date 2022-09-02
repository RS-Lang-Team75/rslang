import { AxiosRequestConfig } from 'axios';

export const setAxiosConfig = (token?: string): AxiosRequestConfig => (
  { headers: {
    'Authorization': token ? `Bearer ${token}` : '',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  } });
