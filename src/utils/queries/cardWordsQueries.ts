import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

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

const SERVER_URL = 'https://rslang-team75.herokuapp.com';

export const setWordsAxiosConfig = (token?:string): AxiosRequestConfig => ({ headers: {
  'Authorization': token ? `Bearer ${token}` : '',
  'Accept': 'application/json',
  'Content-Type': 'application/json',
} });

const answer = {
  correct: 'correct',
  wrong: 'wrong',
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
    setWordsAxiosConfig());
  return response.data;
};

export const getUserWordData: GetWordQueryFunction = async (
  user,
  wordId,
) => (await axios.get<IDifficulty>(
  `${SERVER_URL}/users/${user.userId}/words/${wordId}`,
  setWordsAxiosConfig(user.token),
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
      optional[gameName] = {
        correct: 0,
        wrong: 0,
      };
      optional[allGames] = {
        correct: 0,
        wrong: 0,
      };
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
      setWordsAxiosConfig(user.token),
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
    wordData.optional = currentWordData.optional;
    if (addGameStats && currentWordData && gameName) {
      if (isAnswerCorrect) {
        wordData.optional[gameName][correct] =
          +currentWordData.optional[gameName][correct] + 1;
        wordData.optional[allGames][correct] += 1;
      } else {
        wordData.optional[gameName][wrong] =
          +currentWordData.optional[gameName][wrong] + 1;
        wordData.optional[allGames][wrong] += 1;
      }
    }
    await axios.put<IDifficulty>(
      `${SERVER_URL}/users/${user.userId}/words/${wordId}`,
      wordData,
      setWordsAxiosConfig(user.token),
    );
  } catch (e:unknown) {
    const err = e as AxiosError;
    throw new Error(`PUT query error, ${err.message}`);
  }

};

export const updateOrCreateUserWordData: WordQueryFunction = async (
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
      setWordsAxiosConfig(user.token),
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
  } catch (e: unknown) {
    const err = e as AxiosError;
    if(err.response){
      const res = err.response as AxiosResponse;
      if(res.status === 404 && wordStatus){
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
      }
    } else {
      throw new Error(err.message);
    }
  }
};

export const getStudiedWords  = async (user:UserState, wordPage:number, wordGroup:number):Promise<IWord[]> => {
  try {
    const response = await axios.get<IResponseAggregated[]>(
      `${SERVER_URL}/users/${user.userId}/aggregatedWords?group=${wordGroup}&filter={"$and":[{"page":${wordPage}},{"userWord.difficulty":"studied"}]}`,
      setWordsAxiosConfig(user.token));
    return response.data[0].paginatedResults;
  } catch(e:unknown){
    const err = e as AxiosError;
    throw new Error(err.message);

  }

};
