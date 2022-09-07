/* eslint-disable no-underscore-dangle */
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import React, { useEffect, useRef, useState } from 'react';

import AudioсallAnswers from '../AudiocallAnswers/AudiocallAnswers';
import AudiocallGreetings from '../AudiocallGreetings/AudiocallGreetings';
import { GameButton } from '../GameButton/GameButton';
import { GameResults } from '../GameResults/GameResults';
import { SoundFXControl } from '../SoundFXControl/SoundFXControl';
import { Streak } from '../Streak/Streak';

import { Button } from '@/components/Button/Button';
import { HiddenSoundFX } from '@/components/Games/HiddenSounds/HiddenSoundFX';
import { SoundButton } from '@/components/SoundButton/SoundButton';
import { IWord, PageAndGroup, StateFromBook } from '@/types/types';
import { shuffleArray } from '@/utils/misc';
import { updateOrCreateUserWordData, getWordsQuery, getDifficultWords, getUserWords } from '@/utils/queries/cardWordsQueries';
import { statisticsForStudiedWords } from '@/utils/queries/statisticQueries';
import { SERVER_URL } from '@/utils/queries/url';
import { RootState } from '@/utils/store/store';
import { recordGameStats } from '@/utils/todayStats';

import './Audioсall.pcss';

export default function Audioсall () {

  const words = useLocation();
  const stateFromBook = words.state ? (words.state as StateFromBook) : undefined;
  const unstudiedWords = stateFromBook ? stateFromBook.unstudiedWords : [];
  const allWordsFromBookPage = stateFromBook ? stateFromBook.allWordsFromPage : [];

  const gameName = 'audiocall';
  const answerOptionsPerRound = 5;

  const PageAndGroupRef = useRef<PageAndGroup>({
    page: stateFromBook ? stateFromBook.pageFromBook - 1 : 0,
    group: stateFromBook ? stateFromBook.groupFromBook : 0,
  });

  const [chosenGroup, setChosenGroup] = useState<number>(0);

  const [initialPageWords] = useState<IWord[]>(unstudiedWords || []);

  const [maxRounds, setMaxRounds] = useState<number>(10);

  const [pageWords, setPageWords] = useState<IWord[]>(initialPageWords);
  const [pageWordsFromBook] = useState<IWord[]>(allWordsFromBookPage);
  const [isStartedFromBook] = useState<boolean>(pageWords.length > 0);

  const [wordsForGame, setWordsForGame] = useState<IWord[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<IWord[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<IWord[]>([]);
  const [bestStreak, setBestStreak] = useState<number>(0);

  const currentStreakRef = useRef<number>(0);
  const newWordsNumberRef = useRef<number>(0);
  const isGetWordsHappen = useRef<boolean>(false);

  const [shownWordNumber, setShownWordNumber] = useState<number>(0);

  const [isAnswerGiven, setIsAnswerGiven] = useState<boolean>(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean>(false);

  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);

  const [possibleAnswers, setPossibleAnswers] = useState<string[]>([]);

  const user = useSelector((state: RootState) => state.user);

  const returnRandomWords = async (page: number, group: number): Promise<void> => {
    const randomWords = await getWordsQuery(page, group);
    setPageWords(randomWords);
    setChosenGroup(group + 1);
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

  const checkAnswer = (wordIndex: number): string => {
    const currentWord = wordsForGame[shownWordNumber];
    let additionalClass = '';
    let answer: boolean;

    if (possibleAnswers[wordIndex-1] === currentWord.wordTranslate) {
      answer = true;
      setCorrectAnswers([...correctAnswers, currentWord]);
      additionalClass = 'bg-green-400';
    }
    else {
      answer = false;
      setWrongAnswers([...wrongAnswers, currentWord]);
      additionalClass = 'bg-red-400';
    }

    const wordStatus = answer ? 'studied' : 'learning';

    setIsCorrectAnswer(answer);
    checkStreak(answer);
    setIsAnswerGiven(true);

    updateOrCreateUserWordData(
      user,
      currentWord.id || currentWord._id,
      wordStatus,
      true,
      gameName,
      answer,
    ).then(res => {
      if (!res){
        newWordsNumberRef.current += 1;
      }
    }).catch(() => {
      throw new Error('Cannot update or create user word');
    });

    return additionalClass;
  };

  const refreshStatistics =async () => {
    await statisticsForStudiedWords(user);
  };

  const revealOrNext = async () => {
    if (isAnswerGiven) {
      if (shownWordNumber < wordsForGame.length - 1) {
        setShownWordNumber(n => n + 1);
      } else {
        setShownWordNumber(0);
        setIsGameFinished(true);
        if (user.userId){
          await refreshStatistics();
          recordGameStats(
            user,
            gameName,
            correctAnswers.length,
            wrongAnswers.length,
            bestStreak,
            newWordsNumberRef.current,
          );
        }
      }
      setIsAnswerGiven(false);
      setIsCorrectAnswer(false);
    } else {
      setIsAnswerGiven(true);
      setWrongAnswers([...wrongAnswers, wordsForGame[shownWordNumber]]);
    }
  };

  const gameReset = (): void => {
    setIsGameFinished(false);
    setIsGameStarted(false);
    setIsAnswerGiven(false);
    setCorrectAnswers([]);
    setWrongAnswers([]);
    setShownWordNumber(0);
    setChosenGroup(0);
  };

  const soundToggle = (): void => {
    setIsSoundOn(s => !s);
  };

  useEffect(() => {

    const getMoreWords = async ({ page, group }:PageAndGroup): Promise<void> => {
      PageAndGroupRef.current = {
        page: page - 1,
        group,
      };
      if (page >= 0) {
        if (group === 6) {
          const difficultWords = await getDifficultWords(user, page);
          setPageWords([...pageWords, ...difficultWords.data[0].paginatedResults]);
        } else {
          let randomWords = await getUserWords(user, page, group);
          randomWords = randomWords.filter(w => w.userWord?.difficulty !== 'studied');

          setPageWords([...pageWords,  ...randomWords]);
        }
        isGetWordsHappen.current = true;
      }
      setChosenGroup(group + 1);
    };

    if (pageWords.length >= maxRounds && !isGameFinished) {
      const generateWordsForGame = (): void => {
        const shuffledPageWords = shuffleArray(pageWords);
        const randomWordsForGame = shuffledPageWords.slice(0, maxRounds);
        setWordsForGame(randomWordsForGame);
      };
      generateWordsForGame();
    }
    if (pageWords.length > 0 && pageWords.length < maxRounds) {
      getMoreWords(PageAndGroupRef.current).then(() => {
        if (PageAndGroupRef.current.page < 0 && !isGetWordsHappen.current) {
          setMaxRounds(pageWords.length);
        }
      }).catch(e => console.log(e));
    }
    isGetWordsHappen.current = false;
  }, [pageWords, isGameFinished, user, maxRounds]);

  useEffect(() => {

    const generateAnswers = (word: IWord): void => {
      const arrayOfAnswers = pageWordsFromBook.length > 0 ? pageWordsFromBook : pageWords;
      const answers = [word.wordTranslate];

      if (arrayOfAnswers.length > 5) {
        while (answers.length < answerOptionsPerRound) {
          const ind = Math.floor(Math.random() * arrayOfAnswers.length);
          if (arrayOfAnswers[ind].wordTranslate !== word.wordTranslate) {
            answers.push(arrayOfAnswers[ind].wordTranslate);
          }
        }
        setPossibleAnswers(shuffleArray(answers));
      }
    };

    if (wordsForGame.length > 0) {
      generateAnswers(wordsForGame[shownWordNumber]);
    }
  }, [wordsForGame, shownWordNumber, pageWords, pageWordsFromBook]);

  return(
    <main className='gamesPage'>

      {!isGameStarted && !isGameFinished &&
      <div className='gameSection'>
        <AudiocallGreetings
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
      </div>
      }

      {!isGameFinished && isGameStarted &&
        <section className='gameSection'>
          {
            wordsForGame.length > 0 &&
            <div className='gameSection'>

              {isAnswerGiven &&
                <HiddenSoundFX
                  isAnswerCorrect={isCorrectAnswer}
                  isSoundOn={isSoundOn}
                />}
              <div className="upperGamePart">
                <SoundFXControl
                  isSoundOn={isSoundOn}
                  soundControlCallback={soundToggle}
                />
                <div
                  className='cardAudio'>
                  <SoundButton
                    word= {wordsForGame[shownWordNumber]}
                    classBtn='audioBtn'
                    playFirstOnly
                    playOnMount
                  />
                </div>
                <div className="roundCounter">
                  {`${shownWordNumber + 1}/${maxRounds}`}
                </div>
              </div>
              <div
                className="answerContainer">
                {isAnswerGiven &&
                  <div className= {isCorrectAnswer ? 'answerCorrect' : 'answerIncorrect'}>
                    {wordsForGame[shownWordNumber].wordTranslate}
                  </div>
                }
              </div>
              <div
                className='answerImg'
                style={isAnswerGiven ?
                  { backgroundImage: `url(${SERVER_URL}/${wordsForGame[shownWordNumber].image})` } : {} }
              />
              <Streak
                currentStreak={currentStreakRef.current}
              />
              <AudioсallAnswers
                answers={possibleAnswers}
                shownWordNumber={shownWordNumber}
                checkAnswer={checkAnswer}
                isAnswerGiven={isAnswerGiven}
              />

            </div>
          }
          <GameButton
            text={isAnswerGiven ? 'далее' : 'не знаю'}
            classBtn='nextRound'
            onClick={() => {
              revealOrNext()
                .catch(() => {});
            }}
            simulatedButtonCode="Space"
          />
        </section>
      }
      {
        isGameFinished &&
        <section className='endGame'>
          <GameResults
            correctAnswers={correctAnswers}
            wrongAnswers={wrongAnswers}
            bestStreak={bestStreak}
          />
          <Button text='Начать сначала'
            classBtn='restartBtn'
            onClick={gameReset}/>
        </section>}
    </main>
  );
}
