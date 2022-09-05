import React from 'react';

import './GameResultLine.pcss';
import { SoundButton } from '@/components/SoundButton/SoundButton';
import { IWord } from '@/types/types';

interface IGameResultLine {
  word: IWord;
}

export function GameResultLine (props: IGameResultLine){

  const { word } = props;

  return(
    <section className='resultLine'>
      <SoundButton
        word= {word}
        classBtn='audioBtn'
        playFirstOnly
      />
      <div className='word'>{word.word}</div>
      <div className='dash'> - </div>
      <div className='translation'>{word.wordTranslate}</div>
    </section>
  );
}
