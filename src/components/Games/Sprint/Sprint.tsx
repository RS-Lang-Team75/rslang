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
import { shuffleArray } from '@/utils/misc';

export default function Sprint () {

  const [pageWords, setPageWords] = useState<IWord[]>([]);
  const [wordsForGame, setWordsForGame] = useState<IWord[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<IWord[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<IWord[]>([]);

  const [shownWordNumber, setShownWordNumber] = useState<number>(0);

  const [isStartedFromBook] = useState<boolean>(pageWords.length > 0);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);
  const [currentAnswer, setCurrentAnswer] = useState<boolean>(false);

  const user = useSelector((state: RootState) => state.user);

  console.log('render!');

  const returnRandomWords = async (page: number, group: number): Promise<void> => {
    const randomWords = await getWordsQuery(page, group);
    setPageWords(randomWords);
  };

  const onTimerEnd = () => {
    setIsGameStarted(false);
    setIsGameFinished(true);
    setWordsForGame([]);
  };

  useEffect(() => {
    if (pageWords.length > 0 && !isGameFinished) {
      const generateWordsForGame = (): void => {
        const shuffledPageWords = shuffleArray(pageWords);
        if (isGameStarted) {
          setWordsForGame(w => [...w, ...shuffledPageWords]);
        } else {
          setWordsForGame(shuffledPageWords);
        }
      };
      generateWordsForGame();
      setPageWords([]);
    }
  }, [pageWords, isGameFinished, isGameStarted]);

  return(
    <main className='gamesPage'>
      <div className="gameSection">
        <h2>Sprint</h2>
        <h2>User: {user.name}</h2>
        <h3>ID: {user.userId}</h3>
        {!isGameStarted && !isGameFinished &&
          <>
            {!isStartedFromBook &&
              <DifficultySelector
                returnRandomWords={returnRandomWords} />
            }
            <Button text='Начать игру'
              classBtn='nextRound'
              onClick={() => {
                if (wordsForGame.length > 0) {
                  setIsGameStarted(true);
                }}}
            /></>}
        {wordsForGame.length > 0 && isGameStarted &&
          <Countdown onTimerEnd={onTimerEnd}/>
        }
        {isGameFinished && <section className='flex flex-col justify-center'>
          <h2>Game is finished!</h2>
          <GameResults correctAnswers={correctAnswers} wrongAnswers={wrongAnswers}/>
          <Button text='Начать сначала'
            classBtn='nextRound'
            onClick={() => {
              setIsGameFinished(false);
              setCorrectAnswers([]);
              setWrongAnswers([]);
            }}/>
        </section>}
      </div>
      {wordsForGame.length > 0 && <div className="flex flex-wrap justify-center">
        {wordsForGame.map(w => <div className='nextRound' key={w.id}>{w.wordTranslate}</div> )}
      </div>}
    </main>
  );
}