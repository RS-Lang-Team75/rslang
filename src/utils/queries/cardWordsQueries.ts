import axios, { AxiosError, AxiosResponse } from 'axios';

import { setAxiosConfig } from './headers';
import { getStatisticsData } from './statisticQueries';
import { SERVER_URL } from './url';

import { UserState } from '../slices/userSlice';

import { IDifficulty, IResponseAggregated, IWord } from '@/types/types';

type GetWordQueryFunction = (user: UserState, wordId: string, wordStatus?: string) => Promise<IDifficulty>;
type UpdateWordQueryFunction = (
  user: UserState,
  wordId: string,
  wordStatus: string,
  currentWordData: IDifficulty,
  addGameStats?: boolean,
  gameName?: string,
  isAnswerCorrect?: boolean,
) => Promise<void>;

type WordQueryFunction = (
  user: UserState,
  wordId: string,
  wordStatus: string,
  addGameStats?: boolean,
  gameName?: string,
  isAnswerCorrect?: boolean,
) => Promise<void>;

type WordQueryPutPostFunction = (
  user: UserState,
  wordId: string,
  wordStatus: string,
  addGameStats?: boolean,
  gameName?: string,
  isAnswerCorrect?: boolean,
) => Promise<boolean>;

const answer = {
  correct: 'correct',
  wrong: 'wrong',
};

const initialGameStats = {
  correct: 0,
  wrong: 0,
};

const { correct, wrong } = answer;

const difficulty = {
  difficult: 'difficult',
  studied: 'studied',
  learning: 'learning',
};

const { difficult } = difficulty;

const games = {
  audiocall: 'audiocall',
  sprint: 'sprint',
  allGames: 'allGames',
};

const { allGames } = games;

const setStatusWordData = (wordDifficulty:string): IDifficulty =>
  ({ difficulty: wordDifficulty, optional: {} });

export const getWordsQuery = async (page: number, group: number): Promise<IWord[]> => {
  const response = await axios.get<IWord[]>(
    `${SERVER_URL}/words?group=${group}&page=${page}`,
    setAxiosConfig());
  return response.data;
};

export const getUserWordData: GetWordQueryFunction = async (
  user,
  wordId,
) => (await axios.get<IDifficulty>(
  `${SERVER_URL}/users/${user.userId}/words/${wordId}`,
  setAxiosConfig(user.token),
)).data;

const postUserWordData: WordQueryFunction = async (
  user,
  wordId,
  wordStatus,
  addGameStats?,
  gameName?,
  isAnswerCorrect?) => {
  try {
    const wordData = setStatusWordData(wordStatus);
    const { optional } = wordData;
    if (addGameStats && gameName) {
      optional[gameName] = structuredClone(initialGameStats);
      optional[allGames] = structuredClone(initialGameStats);
      if (isAnswerCorrect) {
        optional[gameName][correct] = 1;
        optional[allGames][correct] = 1;
      } else {
        optional[gameName][wrong] = 1;
        optional[allGames][wrong] = 1;
      }
    }
    await axios.post<IDifficulty>(
      `${SERVER_URL}/users/${user.userId}/words/${wordId}`,
      wordData,
      setAxiosConfig(user.token),
    );
  }
  catch (e:unknown) {
    const err = e as AxiosError;
    throw new Error(`POST query error, ${err.message}`);
  }

};

export const putWordInDifficultData: UpdateWordQueryFunction = async (
  user,
  wordId,
  wordStatus,
  currentWordData,
  addGameStats?,
  gameName?,
  isAnswerCorrect?,
): Promise<void> => {
  try {
    let wordData: IDifficulty;
    if (currentWordData.difficulty === difficult && addGameStats) {
      wordData = setStatusWordData(difficult);
    } else {
      wordData = setStatusWordData(wordStatus);
    }
    if (currentWordData.optional) {
      wordData.optional = structuredClone(currentWordData.optional);
    }
    const { optional } = wordData;
    if (addGameStats && currentWordData && gameName) {
      if (!optional[gameName]) {
        optional[gameName] = structuredClone(initialGameStats);
      }
      if (!optional[allGames]) {
        optional[allGames] = structuredClone(initialGameStats);
      }
      if (isAnswerCorrect) {
        optional[gameName][correct] += 1;
        optional[allGames][correct] += 1;
      } else {
        optional[gameName][wrong] += 1;
        optional[allGames][wrong] += 1;
      }
    }
    await axios.put<IDifficulty>(
      `${SERVER_URL}/users/${user.userId}/words/${wordId}`,
      wordData,
      setAxiosConfig(user.token),
    );
  } catch (e:unknown) {
    const err = e as AxiosError;
    throw new Error(`PUT query error, ${err.message}`);
  }

};

export const updateOrCreateUserWordData: WordQueryPutPostFunction= async (
  user,
  wordId,
  wordStatus,
  addGameStats?,
  gameName?,
  isAnswerCorrect?,
) => {
  try {
    const userWordData = (await axios.get<IDifficulty>(
      `${SERVER_URL}/users/${user.userId}/words/${wordId}`,
      setAxiosConfig(user.token),
    )).data;
    if (addGameStats) {
      await putWordInDifficultData(
        user,
        wordId,
        wordStatus,
        userWordData,
        addGameStats,
        gameName,
        isAnswerCorrect,
      );
    } else {
      await putWordInDifficultData(user, wordId, wordStatus, userWordData);
    }
    return true;
  } catch (e: unknown) {
    const err = e as AxiosError;
    if (err.response) {
      const res = err.response as AxiosResponse;
      if (res.status === 404 && wordStatus) {
        await getStatisticsData(user, 'newWord');
        if (addGameStats) {
          await postUserWordData(
            user,
            wordId,
            wordStatus,
            addGameStats,
            gameName,
            isAnswerCorrect);
        } else {
          await postUserWordData(user, wordId, wordStatus);
        }
        return false;
      }
    } else {
      throw new Error(err.message);
    }
    return false;
  }
};

export const getStudiedWords  = async (user:UserState, wordPage:number, wordGroup:number):Promise<IWord[]> => {
  try {
    const response = await axios.get<IResponseAggregated[]>(
      `${SERVER_URL}/users/${user.userId}/aggregatedWords?group=${wordGroup}&filter={"$and":[{"page":${wordPage}},{"userWord.difficulty":"studied"}]}`,
      setAxiosConfig(user.token));
    return response.data[0].paginatedResults;
  }
  catch (e:unknown) {
    const err = e as AxiosError;
    throw new Error(err.message);
  }
};

export const getDifficultWords = async (user: UserState, page: number) => axios.get<IResponseAggregated[]>(
  `${SERVER_URL}/users/${user.userId}/aggregatedWords?page=${page}&filter={"$and":[{"userWord.difficulty":"difficult"}]}`,
  setAxiosConfig(user.token));
