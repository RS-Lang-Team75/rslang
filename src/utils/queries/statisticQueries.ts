import axios, { AxiosError, AxiosResponse } from 'axios';

import { setAxiosConfig } from './headers';
import { SERVER_URL } from './url';

import { UserState } from '../slices/userSlice';

import { IResponseAggregated, StatisticsByDay, UserStatistics } from '@/types/types';

type PutWordQueryFunction = (
  user: UserState,
  userStatisticsFromGet: UserStatistics,
  allStudiedWords?:number
) => Promise<void>;

type GetWordQueryFunction = (
  user: UserState,
  flag:string,
  allStudiedWords?:number
) => Promise<void>;

type GetStudiedWordFunction = (
  user: UserState
) => Promise<void>;

const userStatistics:UserStatistics = {
  learnedWords:0,
  optional:{
    stateLearnedByDay:'[]',
    stateNewWords:'[]',
    stateLearnedLong:'[]',
  },
};

export const getDate = ():string=>{
  const date = new Date();
  return`${date.getFullYear()} ${date.toDateString().substring(4, 7)} ${date.getDate()}`;
};

export const putStudiedWordInStatisticsData: PutWordQueryFunction = async (
  user,
  userStatisticsFromGet,
  allStudiedWords=0,
): Promise<void> => {
  try {
    const { optional } = userStatisticsFromGet;
    const today = getDate();

    const stateStudiedWordsByDayParse =
    JSON.parse(optional.stateLearnedByDay) as StatisticsByDay[];
    const stateStudiedWordsForAllTimeParse =
    JSON.parse(optional.stateLearnedLong) as StatisticsByDay[];

    let stateLen = stateStudiedWordsByDayParse.length;
    let lastSign = stateStudiedWordsByDayParse[stateLen - 1];

    if (stateLen === 0 ) {
      stateStudiedWordsForAllTimeParse.push({
        date: today,
        learnedWordsLong: allStudiedWords,
      });
      stateStudiedWordsByDayParse.push({
        date: today,
        learnedWordsByDay: allStudiedWords,
      });
    }
    else if (stateLen === 1 && lastSign.date === today) {
      stateStudiedWordsForAllTimeParse[0].learnedWordsLong = allStudiedWords;
      stateStudiedWordsByDayParse[0].learnedWordsByDay = allStudiedWords;
    }
    else if (stateLen >= 1 && lastSign.date !== today) {
      stateStudiedWordsForAllTimeParse.push({
        date: today,
        learnedWordsLong: allStudiedWords,
      });
      const sumPrevLearnedWords = stateStudiedWordsByDayParse
        .reduce(( prev, cur ) => cur.learnedWordsByDay ? prev + +cur.learnedWordsByDay :0 , 0);
      let studiedWordsByDay = allStudiedWords - sumPrevLearnedWords;
      if ( studiedWordsByDay <= 0 ) {
        studiedWordsByDay = 0;
      }
      stateStudiedWordsByDayParse.push({
        date: today,
        learnedWordsByDay: studiedWordsByDay,
      });
      stateLen = stateStudiedWordsByDayParse.length;
      lastSign = stateStudiedWordsByDayParse[stateLen - 1];
    }
    else {
      const sumPrevLearnedWords = stateStudiedWordsByDayParse
        .slice(0, -1)
        .reduce(( prev, cur ) => cur.learnedWordsByDay ? prev + +cur.learnedWordsByDay :0 , 0);
      let studiedWordsByDay = allStudiedWords - sumPrevLearnedWords;
      if (studiedWordsByDay <= 0) {
        studiedWordsByDay = 0;
      }
      lastSign.learnedWordsByDay = studiedWordsByDay;
      stateStudiedWordsForAllTimeParse[stateLen - 1].learnedWordsLong = allStudiedWords;
    }

    optional.stateLearnedByDay = JSON.stringify(stateStudiedWordsByDayParse);
    optional.stateLearnedLong = JSON.stringify(stateStudiedWordsForAllTimeParse);

    userStatistics.learnedWords = allStudiedWords;
    userStatistics.optional = userStatisticsFromGet.optional;

    await axios.put<UserStatistics>(
      `${SERVER_URL}/users/${user.userId}/statistics`,
      userStatistics,
      setAxiosConfig(user.token),
    );

  } catch(e:unknown){
    const err = e as AxiosError;
    throw new Error(`PUT to studied statistic query error, ${err.message}`);
  }

};

export const putNewWordInStatisticsData: PutWordQueryFunction = async (
  user,
  userStatisticsFromGet,
): Promise<void> => {
  try {
    const { optional } = userStatisticsFromGet;
    const today = getDate();

    const stateNewWordsParse:StatisticsByDay[] =
    JSON.parse(optional.stateNewWords) as StatisticsByDay[];

    let stateLen = stateNewWordsParse.length;
    let lastSign = stateNewWordsParse[stateLen - 1];

    if (stateLen === 0 || lastSign.date !== today) {
      stateNewWordsParse.push({
        date: today,
        newWords: 1,
      });
      stateLen = stateNewWordsParse.length;
      lastSign = stateNewWordsParse[stateLen - 1];
    }
    else {
      (lastSign.newWords as number) += 1;
    }

    optional.stateNewWords = JSON.stringify(stateNewWordsParse);

    userStatistics.learnedWords = userStatisticsFromGet.learnedWords;
    userStatistics.optional = userStatisticsFromGet.optional;

    await axios.put<UserStatistics>(
      `${SERVER_URL}/users/${user.userId}/statistics`,
      userStatistics,
      setAxiosConfig(user.token),
    );
  } catch (e:unknown) {
    const err = e as AxiosError;
    throw new Error(`statistics PUT query error, ${err.message}`);
  }
};

export const getStatisticsData: GetWordQueryFunction = async (user, flag, allStudiedWords): Promise<void> => {
  try {
    const response = await axios.get<UserStatistics>(
      `${SERVER_URL}/users/${user.userId}/statistics`,
      setAxiosConfig(user.token));

    if(flag === 'newWord') {
      await putNewWordInStatisticsData(user, response.data);
    }
    if(flag === 'studiedWords') {
      await putStudiedWordInStatisticsData(user, response.data, allStudiedWords);
    }

  } catch (e: unknown) {
    const err = e as AxiosError;
    if (err.response) {
      const res = err.response as AxiosResponse;
      if (res.status === 404 && flag === 'newWord') {
        await putNewWordInStatisticsData(user, userStatistics);
      }
    }
    else {
      throw new Error(`GET to statistic query error, ${err.message}`);
    }
  }
};

export const statisticsForStudiedWords:GetStudiedWordFunction = async user=>{
  try {
    const response = await axios.get<IResponseAggregated[]>(
      `${SERVER_URL}/users/${user.userId}/aggregatedWords?wordsPerPage=3600&filter={"$and":[{"userWord.difficulty":"studied"}]}`,
      setAxiosConfig(user.token));

    let allStudiedWords = 0;

    if (response.data[0].totalCount.length > 0) {
      allStudiedWords = response.data[0].totalCount[0].count;
    }

    await getStatisticsData(user,'studiedWords', allStudiedWords);

  } catch (e:unknown) {
    const err = e as AxiosError;
    throw new Error(`Studied statistic query error, ${err.message}`);
  }
};
