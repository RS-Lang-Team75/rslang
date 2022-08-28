import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { UserState } from '../slices/userSlice';

import { IDifficult } from '@/types/types';

type CardWordQueryFunction = (user:UserState, wordStatus:string, wordId:string) => Promise<void> ;
const SERVER_URL = 'https://rslang-team75.herokuapp.com';

export const setWordsAxiosConfig = (token:string): AxiosRequestConfig => ({ headers: {
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json',
} });

const setStatusWordData = (wordStatus:string):IDifficult =>
  ({ difficulty: wordStatus, optional: {} });

const postWordInDifficultData:CardWordQueryFunction = async (user, wordStatus, wordId) => {
  try {
    await axios.post<IDifficult>(
      `${SERVER_URL}/users/${user.userId}/words/${wordId}`,
      setStatusWordData(wordStatus),
      setWordsAxiosConfig(user.token),
    );
    // console.log(response.data);

  }
  catch (e:unknown) {
    const error = e as AxiosError;
    console.log('post err: ', error);
  }

};

export const putWordInDifficultData:CardWordQueryFunction = async (user, wordStatus, wordId): Promise<void> => {

  try {
    await axios.put<IDifficult>(
      `${SERVER_URL}/users/${user.userId}/words/${wordId}`,
      setStatusWordData(wordStatus),
      setWordsAxiosConfig(user.token),
    );
    // console.log(response.data);

  } catch (e:unknown) {
    const err = e as AxiosError;
    console.log('put err: ', err);
  }

};

export const getWordInDifficultData:CardWordQueryFunction = async (user, wordStatus, wordId)=> {
  try {
    await axios.get<IDifficult>(
      `${SERVER_URL}/users/${user.userId}/words/${wordId}`,
      setWordsAxiosConfig(user.token),
    );
    // console.log(response.data);
    // return response.data;

  } catch(e:unknown){
    const err = e as AxiosError;
    if(err.response){
      const res = err.response as AxiosResponse;
      if(res.status === 404 ){
        await postWordInDifficultData (user, wordStatus, wordId);
      }
    }
    throw new Error(err.message);
  }
};
