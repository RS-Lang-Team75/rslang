import { useSelector } from 'react-redux';

import React from 'react';

import { DifficultySelector } from '../DifficultySelector/DifficultySelector';

import { randomWordsQuery } from '@/utils/queries/wordsQueries';
import { RootState } from '@/utils/store/store';

export function Audiocall (){

  const user = useSelector((state: RootState) => state.user);

  const returnRandomWords = async (page: number, group: number): Promise<void> => {
    console.log(await randomWordsQuery(page, group));
  };

  return(
    <main>
      <h1>Audiocall</h1>
      <p>User: {user.name}</p>
      <p>ID: {user.userId}</p>
      <DifficultySelector
        returnRandomWords={returnRandomWords}
      />
    </main>
  );
}
