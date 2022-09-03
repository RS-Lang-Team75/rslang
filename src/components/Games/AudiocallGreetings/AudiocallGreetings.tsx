import React from 'react';

import { DifficultySelector } from '../DifficultySelector/DifficultySelector';

import './AudiocallGreetings.pcss';

interface AudiocallGreetings {
  isStartedFromBook: boolean;
  chosenGroup: number;
  returnRandomWords: (page: number, group: number) => Promise<void>;
}

export default function AudioсallGreetings (props: AudiocallGreetings): JSX.Element {

  const {
    isStartedFromBook,
    chosenGroup,
    returnRandomWords,
  } = props;

  return(
    <div
      className='greetings'>
      <h2
        className='greetingsHeader'>
          Аудиовызов
      </h2>
      <h3
        className='greetingsText'>
          Аудиовызов проверяет твои способности воспринимать речь на слух.
      </h3>
      <h3
        className='greetingsText'>
          Для выбора ответа используй цифры 1-5.
      </h3>
      <h3
        className='greetingsText'>
          Для перехода к следующему слову используй пробел.
      </h3>
      {!isStartedFromBook &&
        <DifficultySelector
          returnRandomWords={returnRandomWords}
          chosenGroup={chosenGroup}
        />}
    </div>
  );
}
