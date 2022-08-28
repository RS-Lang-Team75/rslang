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
  userWord?: IDifficult;
}

export interface IDifficult{
  wordId?: string;
  difficulty:string;
  optional:{[key:string]:string};
}

export interface IResponseAggregated{
  paginatedResults: IWord[];
  totalCount:[{count: number}];
}
