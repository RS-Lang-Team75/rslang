export interface IWord{
  id: string;
  _id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
  userWord?: IDifficulty;
}

export type GameName = 'audiocall' | 'sprint';

export interface PageAndGroup {
  page: number;
  group: number;
}

export interface GameStats {
  correct: number;
  wrong: number;
}

export interface IDifficulty{
  wordId?: string;
  difficulty:string;
  optional:{
    [key:string]:GameStats;
  };
}

export interface IResponseAggregated{
  paginatedResults: IWord[];
  totalCount:[{count: number}];
}

export interface UserStatistics {
  learnedWords:number;
  optional:StatisticsStates;
}
export interface StatisticsStates{
  stateLearnedByDay:string;
  stateNewWords:string;
  stateLearnedLong:string;
}
export interface StatisticsByDay{
  date?:string;
  learnedWordsByDay?: number;
  newWords?: number;
  learnedWordsLong?:number;
}

export interface StateFromBook {
  unstudiedWords: IWord[];
  pageFromBook: number;
  groupFromBook: number;
  allWordsFromPage: IWord[];
}
