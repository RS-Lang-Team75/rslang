import React from 'react';

import './GameResultLine.pcss';
import { IWord } from '@/types/types';

interface IGameResultLine {
  word: IWord;
}

export function GameResultLine (props: IGameResultLine){

  const { word } = props;

  return(
    <section>
      <div>{word.word}</div>
    </section>
  );
}
