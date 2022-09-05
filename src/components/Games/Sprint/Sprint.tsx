/* eslint-disable no-underscore-dangle */
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import React, { useEffect, useRef, useState } from 'react';

import Countdown from '../Countdown/Countdown';
import { GameButton } from '../GameButton/GameButton';
import { GameResults } from '../GameResults/GameResults';
import { HiddenSoundFX } from '../HiddenSounds/HiddenSoundFX';
import { SoundFXControl } from '../SoundFXControl/SoundFXControl';
import SprintGreetings from '../SprintGreetings/SprintGreetings';

import { Button } from '@/components/Button/Button';
import { IWord } from '@/types/types';
import { shuffleArray } from '@/utils/misc';
import { getDifficultWords, getStudiedWords, getWordsQuery, updateOrCreateUserWordData } from '@/utils/queries/cardWordsQueries';
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
    page: stateFromBook ? stateFromBook.pageFromBook - 1 : 0,
    group: stateFromBook ? stateFromBook.groupFromBook : 0,
  });

  const gameName = 'sprint';
  const addWordsDelta = 3;

  const [chosenGroup, setChosenGroup] = useState<number>(
    stateFromBook ? stateFromBook.groupFromBook : 0);
  const [initialPage] = useState(stateFromBook ? stateFromBook.pageFromBook : 0);

  const [initialPageWords] = useState<IWord[]>(unstudiedWords || []);

  const [pageWords, setPageWords] = useState<IWord[]>(initialPageWords);
  const [wordsForGame, setWordsForGame] = useState<IWord[]>([]);

  const [correctAnswers, setCorrectAnswers] = useState<IWord[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<IWord[]>([]);
  const [bestStreak, setBestStreak] = useState<number>(0);

  const currentStreakRef = useRef<number>(0);
  const newWordsNumberRef = useRef<number>(0);
  const isGetWordsHappen = useRef<boolean>(false);

  const [isStartedFromBook] = useState<boolean>(pageWords.length > 0);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  const [shownWordNumber, setShownWordNumber] = useState<number>(0);
  const [sprintWord, setSprintWord] = useState<SprintWord>(emptySprintWord);

  const user = useSelector((state: RootState) => state.user);

  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean>(false);

  const soundToggle = (): void => {
    setIsSoundOn(s => !s);
  };

  const onTimerEnd = () => {
    setIsGameStarted(false);
    setIsGameFinished(true);
    setWordsForGame([]);
    PageAndGroupRef.current.page = initialPage - 1;
    recordGameStats(
      user,
      gameName,
      correctAnswers.length,
      wrongAnswers.length,
      bestStreak,
      newWordsNumberRef.current,
    );
  };

  const returnRandomWords = async (page: number, group: number): Promise<void> => {
    PageAndGroupRef.current = {
      page: page - 1,
      group,
    };
    if (page >= 0) {
      if (group === 6) {
        const difficultWords = await getDifficultWords(user, page);
        setPageWords(difficultWords.data[0].paginatedResults);
      } else {
        let randomWords = await getWordsQuery(page, group);
        if (user.userId) {
          const studiedWords = await getStudiedWords(user, page, group);
          randomWords = randomWords.filter(w => !studiedWords.find(sw => sw._id === w.id));
        };
        setPageWords(randomWords);
      }
      isGetWordsHappen.current = true;
    }
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
    setIsCorrectAnswer(isCorrect);
    const wordStatus = isCorrect ? 'studied' : 'learning';
    checkStreak(isCorrect);

    setShownWordNumber(n => n + 1);

    updateOrCreateUserWordData(
      user,
      (wordsForGame[shownWordNumber].id || wordsForGame[shownWordNumber]._id),
      wordStatus,
      true,
      gameName,
      isCorrect,
    ).then(res => {
      if (!res){
        newWordsNumberRef.current += 1;
      }
    }).catch(() => {
      throw new Error('Cannot update or create user word');
    });

    if (shownWordNumber === wordsForGame.length - 1) {
      onTimerEnd();
    }
  };

  const gameReset = () => {
    setIsGameFinished(false);
    setCorrectAnswers([]);
    setWrongAnswers([]);
    setShownWordNumber(0);
    setChosenGroup(0);
    setPageWords(initialPageWords);
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
    isGetWordsHappen.current = false;
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
    }

    if (wordsForGame.length > 0 && !isGetWordsHappen.current) {
      prepareWord();
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameStarted, shownWordNumber]);

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

      {!isGameFinished && <div className="gameSection">
        {!isGameStarted && !isGameFinished &&
          <>
            <SprintGreetings
              isStartedFromBook={isStartedFromBook}
              returnRandomWords={returnRandomWords}
              chosenGroup={chosenGroup}
            />
            <Button text='Начать игру'
              classBtn='nextRound'
              disabled={wordsForGame.length === 0}
              onClick={() => {
                if (wordsForGame.length > 0) {
                  setIsGameStarted(true);
                }
              }}/>
          </>
        }

        {wordsForGame.length > 0 && isGameStarted &&
          <>
            {shownWordNumber > 0 &&
                <HiddenSoundFX
                  isAnswerCorrect={isCorrectAnswer}
                  isSoundOn={isSoundOn}
                  wordNumber={shownWordNumber}
                />
            }
            <div className="upperGamePart">
              <SoundFXControl
                isSoundOn={isSoundOn}
                soundControlCallback={soundToggle}
              />
              <Countdown onTimerEnd={onTimerEnd} />
              <div className="roundCounter" />
            </div>
            <div className='sprintWordsContainer'>
              <div
                className='sprintWord'>
                {sprintWord.wordEnglish}
              </div>
              <div>это</div>
              <div
                className='sprintWord'>
                {sprintWord.wordTranslation}
              </div>
              <div
                className='sprintWord'>?</div>
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
      </div>}
      {isGameFinished &&
          <section className='endGame'>
            <GameResults correctAnswers={correctAnswers} wrongAnswers={wrongAnswers}/>
            <Button text='Начать сначала'
              classBtn='restartBtn'
              onClick={gameReset}
            />
          </section>}
    </main>
  );
}
