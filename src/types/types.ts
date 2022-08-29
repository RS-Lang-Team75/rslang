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
