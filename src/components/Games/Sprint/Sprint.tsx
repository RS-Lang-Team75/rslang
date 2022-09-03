import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import React, { useEffect, useRef, useState } from 'react';

import Countdown from '../Countdown/Countdown';
import { DifficultySelector } from '../DifficultySelector/DifficultySelector';
import { GameButton } from '../GameButton/GameButton';
import { GameResults } from '../GameResults/GameResults';

import { Button } from '@/components/Button/Button';
import { IWord } from '@/types/types';
import { shuffleArray } from '@/utils/misc';
import { getWordsQuery, updateOrCreateUserWordData } from '@/utils/queries/cardWordsQueries';
import { statisticsForStudiedWords } from '@/utils/queries/statisticQueries';
import { RootState } from '@/utils/store/store';
import { recordGameStats } from '@/utils/todayStats';

import './Sprint.pcss';

interface SprintWord {
  wordEnglish: string;
  wordTranslation: string;
  isAnswerCorrect: boolean;
}

interface PageAndGroup {
  page: number;
  group: number;
}

interface SprintFromBookState {
  unstudiedWords: IWord[];
  pageFromBook: number;
  groupFromBook: number;
}

export default function Sprint () {

  const words = useLocation();
  const stateFromBook = words.state ? (words.state as SprintFromBookState) : undefined;
  const unstudiedWords = stateFromBook ? stateFromBook.unstudiedWords : [];

  const emptySprintWord = {
    wordEnglish: '',
    wordTranslation: '',
    isAnswerCorrect: false,
  };

  const PageAndGroupRef = useRef<PageAndGroup>({
    page: stateFromBook ? stateFromBook.pageFromBook + 1 : 0,
    group: stateFromBook ? stateFromBook.groupFromBook : 0,
  });

  const gameName = 'sprint';
  const addWordsDelta = 3;

  const [chosenGroup, setChosenGroup] = useState<number>(0);

  const [pageWords, setPageWords] = useState<IWord[]>(unstudiedWords || []);
  const [wordsForGame, setWordsForGame] = useState<IWord[]>([]);

  const [correctAnswers, setCorrectAnswers] = useState<IWord[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<IWord[]>([]);
  const [bestStreak, setBestStreak] = useState<number>(0);

  const currentStreakRef = useRef<number>(0);
  const newWordsNumberRef = useRef<number>(0);

  const [isStartedFromBook] = useState<boolean>(pageWords.length > 0);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  const [shownWordNumber, setShownWordNumber] = useState<number>(0);
  const [sprintWord, setSprintWord] = useState<SprintWord>(emptySprintWord);

  const user = useSelector((state: RootState) => state.user);

  const returnRandomWords = async (page: number, group: number): Promise<void> => {
    const randomWords = await getWordsQuery(page, group);
    setPageWords(randomWords);
    PageAndGroupRef.current = {
      page: page < 29 ? page + 1 : 0,
      group,
    };
    setChosenGroup(group + 1);
  };

  const onTimerEnd = () => {
    setIsGameStarted(false);
    setIsGameFinished(true);
    setWordsForGame([]);
    recordGameStats(
      user,
      gameName,
      correctAnswers.length,
      wrongAnswers.length,
      bestStreak,
      newWordsNumberRef.current,
    );
  };

  const checkStreak = (isCorrect: boolean): void => {
    if (isCorrect) {
      currentStreakRef.current += 1;
    } else {
      currentStreakRef.current = 0;
    }
    if (currentStreakRef.current > bestStreak) {
      setBestStreak(currentStreakRef.current);
    }
  };

  const checkAnswer = (answer: boolean) => {
    let isCorrect: boolean;

    if (sprintWord.isAnswerCorrect === answer) {
      setCorrectAnswers(a => [...a, wordsForGame[shownWordNumber]]);
      isCorrect = true;
    } else {
      setWrongAnswers(a => [...a, wordsForGame[shownWordNumber]]);
      isCorrect = false;
    }

    const wordStatus = isCorrect ? 'studied' : 'learning';
    checkStreak(isCorrect);

    setShownWordNumber(n => n + 1);

    updateOrCreateUserWordData(
      user,
      wordsForGame[shownWordNumber].id,
      wordStatus,
      true,
      gameName,
      isCorrect,
    ).catch(e => {
      const error = e as Error;
      if (error.message === 'new word') {
        newWordsNumberRef.current += 1;
      }
    });
  };

  const gameReset = () => {
    setIsGameFinished(false);
    setCorrectAnswers([]);
    setWrongAnswers([]);
    setWordsForGame([]);
    setShownWordNumber(0);
    setChosenGroup(0);
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

  useEffect(() => {
    let isGetWordsHappen = false;
    const prepareWord = () => {
      const dice = Math.random();

      if (dice < 0.5) {
        // take random translation (answer is false)
        const delta = Math.ceil(dice * (wordsForGame.length - shownWordNumber - 1));
        setSprintWord({
          wordEnglish: wordsForGame[shownWordNumber].word,
          wordTranslation: wordsForGame[shownWordNumber + delta].wordTranslate,
          isAnswerCorrect: false,
        });
      }
      else {
        // (answer is true)
        setSprintWord({
          wordEnglish: wordsForGame[shownWordNumber].word,
          wordTranslation: wordsForGame[shownWordNumber].wordTranslate,
          isAnswerCorrect: true,
        });
      }
    };

    if (isGameStarted && (wordsForGame.length - shownWordNumber < addWordsDelta)) {
      const { page, group } = PageAndGroupRef.current;
      returnRandomWords(page, group)
        .catch(err => {
          if (typeof err === 'string') {
            throw new Error(err);
          }
        });
      isGetWordsHappen = true;
    }

    if (wordsForGame.length > 0 && !isGetWordsHappen) {
      prepareWord();
    }

  }, [isGameStarted, shownWordNumber, wordsForGame]);

  useEffect(() => {
    if (isGameFinished) {
      statisticsForStudiedWords(user)
        .catch(() => {
          throw new Error('Cannot show next word');
        });
    }
  }, [isGameFinished, user]);

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
                returnRandomWords={returnRandomWords}
                chosenGroup={chosenGroup}
              />
            }
            <Button text='Начать игру'
              classBtn='nextRound'
              onClick={() => {
                if (wordsForGame.length > 0) {
                  setIsGameStarted(true);
                }
              }}/>
          </>
        }
        {wordsForGame.length > 0 && isGameStarted &&
          <>
            <Countdown onTimerEnd={onTimerEnd} />
            <div className="flex justify-center gap-5">
              <div>{sprintWord.wordEnglish}</div>
              <div>ЭТО</div>
              <div>{sprintWord.wordTranslation}</div>
              <div>?????</div>
            </div>
            <div className="answerButtonsContainer">
              <GameButton
                text='неверно'
                classBtn='answerBtn leftBtn'
                onClick={() => checkAnswer(false)}
                simulatedButtonCode="ArrowLeft"/>
              <GameButton
                text='верно'
                classBtn='answerBtn rightBtn'
                onClick={() => checkAnswer(true)}
                simulatedButtonCode="ArrowRight"/>
            </div>
          </>
        }
        {isGameFinished &&
          <section className='flex flex-col justify-center'>
            <h2>Game is finished!</h2>
            <GameResults correctAnswers={correctAnswers} wrongAnswers={wrongAnswers}/>
            <Button text='Начать сначала'
              classBtn='nextRound'
              onClick={gameReset}
            />
          </section>}
      </div>
    </main>
  );
}
