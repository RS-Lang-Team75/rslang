import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { UserState } from '../slices/userSlice';

import { StatisticsByDay, UserStatistics } from '@/types/types';

type PutWordQueryFunction = (
  user: UserState,
  userStatisticsFromGet: UserStatistics,
) => Promise<void>;
type GetWordQueryFunction = (
  user: UserState,
) => Promise<void>;
const SERVER_URL = 'https://rslang-team75.herokuapp.com';

const userStatistics:UserStatistics = {
  learnedWords:0,
  optional:{
    stateLearnedByDay:'[]',
    stateNewWords:'[]',
    stateLearnedLong:'[]',
  },
};

const setWordsAxiosConfig = (token?:string): AxiosRequestConfig => ({ headers: {
  'Authorization': token ? `Bearer ${token}` : '',
  'Accept': 'application/json',
  'Content-Type': 'application/json',
} });

const getDate = ():string=>{
  const date = new Date();
  return`${date.getFullYear()} ${date.toDateString().substr(4, 3)} ${date.getDate()}`;
};

export const putNewWordInStatisticsData: PutWordQueryFunction = async (
  user,
  userStatisticsFromGet,
): Promise<void> => {
  try {
    console.log('userStatisticsFromGet: ',userStatisticsFromGet);
    const { optional } = userStatisticsFromGet;
    const today = getDate();

    const stateNewWordsParse:StatisticsByDay[] =
    JSON.parse(optional.stateNewWords) as StatisticsByDay[];

    let stateLen = stateNewWordsParse.length;
    let lastSign = stateNewWordsParse[stateLen - 1];
    if(stateLen === 0 || lastSign.date !== today){
      stateNewWordsParse.push({ date: today, newWords: 1 });
      stateLen = stateNewWordsParse.length;
      lastSign = stateNewWordsParse[stateLen - 1];
    }else{
      (lastSign.newWords as number) += 1;
    }

    optional.stateNewWords = JSON.stringify(stateNewWordsParse);

    userStatistics.learnedWords = userStatisticsFromGet.learnedWords;
    userStatistics.optional = userStatisticsFromGet.optional;

    await axios.put<UserStatistics>(
      `${SERVER_URL}/users/${user.userId}/statistics`,
      userStatistics,
      setWordsAxiosConfig(user.token),
    );
  } catch (e:unknown) {
    const err = e as AxiosError;
    throw new Error(`PUT to statistics query error, ${err.message}`);
  }
};

export const getStatisticsData: GetWordQueryFunction = async (user): Promise<void> => {
  try {
    const response = await axios.get<UserStatistics>(
      `${SERVER_URL}/users/${user.userId}/statistics`,
      setWordsAxiosConfig(user.token));

    console.log('response get Statistics: ', response.data);

    await putNewWordInStatisticsData(user, response.data);

  } catch (e: unknown) {
    const err = e as AxiosError;
    if(err.response){
      const res = err.response as AxiosResponse;
      if(res.status === 404 ){
        await putNewWordInStatisticsData(user, userStatistics);
      }
    } else {
      throw new Error(err.message);
    }
  }
};
