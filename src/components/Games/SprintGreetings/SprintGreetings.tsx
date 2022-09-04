import React from 'react';

import { DifficultySelector } from '../DifficultySelector/DifficultySelector';

import './SprintGreetings.pcss';

interface ISprintGreetings {
  isStartedFromBook: boolean;
  chosenGroup: number;
  returnRandomWords: (page: number, group: number) => Promise<void>;
}

export default function SprintGreetings (props: ISprintGreetings): JSX.Element {

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
          Спринт
      </h2>
      <h3
        className='greetingsText'>
          Спринт - это проверка твоих знаний на скорость.
      </h3>
      <h3
        className='greetingsText'>
          Для выбора ответа используй стрелки влево и вправо.
      </h3>
      {!isStartedFromBook &&
        <DifficultySelector
          returnRandomWords={returnRandomWords}
          chosenGroup={chosenGroup}
        />}
    </div>
  );
}
