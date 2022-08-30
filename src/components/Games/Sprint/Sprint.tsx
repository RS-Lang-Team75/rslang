import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import React, { useEffect, useRef, useState } from 'react';

import Countdown from '../Countdown/Countdown';
import { DifficultySelector } from '../DifficultySelector/DifficultySelector';
import { GameButton } from '../GameButton/GameButton';
import { GameResults } from '../GameResults/GameResults';

import { Button } from '@/components/Button/Button';
import { SoundButton } from '@/components/SoundButton/SoundButton';
import { IWord } from '@/types/types';
import { updateOrCreateUserWordData, getWordsQuery } from '@/utils/queries/cardWordsQueries';
import { RootState } from '@/utils/store/store';

import './Sprint.pcss';

export default function Sprint () {

  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  const user = useSelector((state: RootState) => state.user);

  const onTimerEnd = () => {
    setIsGameFinished(true);
  }

  return(
    <main className='gamesPage'>
      <div className="gameSection">
        <h2>Sprint</h2>
        <h2>User: {user.name}</h2>
        <h3>ID: {user.userId}</h3>
        <Countdown onTimerEnd={onTimerEnd}/>
        {isGameFinished && <p>OVER!</p> }
      </div>
    </main>
  );
}
