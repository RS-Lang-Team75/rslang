import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import React, { useEffect, useState } from 'react';

import AudioсallAnswers from '../AudiocallAnswers/AudiocallAnswers';
import { DifficultySelector } from '../DifficultySelector/DifficultySelector';
import { GameButton } from '../GameButton/GameButton';
import { GameResults } from '../GameResults/GameResults';

import { Button } from '@/components/Button/Button';
import { SoundButton } from '@/components/SoundButton/SoundButton';
import { IWord } from '@/types/types';
import { shuffleArray } from '@/utils/misc';
import { updateOrCreateUserWordData, getWordsQuery } from '@/utils/queries/cardWordsQueries';
import { statisticsForStudiedWords } from '@/utils/queries/statisticQueries';
import { SERVER_URL } from '@/utils/queries/url';
import { RootState } from '@/utils/store/store';

import './Audioсall.pcss';

interface AudiocallFromBookState {
  unstudiedWords: IWord[];
  allWordsFromPage: IWord[];
}

export default function Audioсall () {

  const words = useLocation();
  const stateFromBook = words.state ? (words.state as AudiocallFromBookState) : undefined;
  const unstudiedWords = stateFromBook ? stateFromBook.unstudiedWords : [];
  const allWordsFromBookPage = stateFromBook ? stateFromBook.allWordsFromPage : [];

  const gameName = 'audiocall';
  const answerOptionsPerRound = 5;
  const roundsNumber = unstudiedWords.length < 10 ? 10 : unstudiedWords.length;

  const [chosenGroup, setChosenGroup] = useState<number>(0);

  const [pageWords, setPageWords] = useState<IWord[]>(unstudiedWords || []);
  const [pageWordsFromBook] = useState<IWord[]>(allWordsFromBookPage);
  const [isStartedFromBook] = useState<boolean>(pageWords.length > 0);

  const [wordsForGame, setWordsForGame] = useState<IWord[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<IWord[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<IWord[]>([]);

  const [shownWordNumber, setShownWordNumber] = useState<number>(0);

  const [isAnswerGiven, setIsAnswerGiven] = useState<boolean>(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean>(false);

  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  const [possibleAnswers, setPossibleAnswers] = useState<string[]>([]);

  const user = useSelector((state: RootState) => state.user);

  const returnRandomWords = async (page: number, group: number): Promise<void> => {
    const randomWords = await getWordsQuery(page, group);
    setPageWords(randomWords);
    setChosenGroup(group + 1);
  };

  const checkAnswer = (wordIndex: number): string => {
    const currentWord = wordsForGame[shownWordNumber];
    let additionalClass = '';
    if (!isAnswerGiven) {
      if (possibleAnswers[wordIndex-1] === currentWord.wordTranslate) {
        setIsCorrectAnswer(true);
        setCorrectAnswers([...correctAnswers, currentWord]);
        additionalClass = 'bg-green-400';
        updateOrCreateUserWordData(
          user,
          currentWord.id,
          'studied',
          true,
          gameName,
          true,
        ).catch(() => {throw new Error('Cannot update or create word');});
      }
      else {
        setIsCorrectAnswer(false);
        setWrongAnswers([...wrongAnswers, currentWord]);
        additionalClass = 'bg-red-400';
        updateOrCreateUserWordData(
          user,
          currentWord.id,
          'learning',
          true,
          gameName,
          false,
        ).catch(() => {throw new Error('Cannot update or create word');});
      }
      setIsAnswerGiven(true);
    }
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
        await refreshStatistics();
      }
      setIsAnswerGiven(false);
      setIsCorrectAnswer(false);
    } else {
      setIsAnswerGiven(true);
      setWrongAnswers([...wrongAnswers, wordsForGame[shownWordNumber]]);
    }
  };

  const gameReset = () => {
    setIsGameFinished(false);
    setIsGameStarted(false);
    setIsAnswerGiven(false);
    setCorrectAnswers([]);
    setWrongAnswers([]);
    setShownWordNumber(0);
    setChosenGroup(0);
  };

  useEffect(() => {
    if (pageWords.length > 0 && !isGameFinished) {
      const generateWordsForGame = (): void => {
        const shuffledPageWords = shuffleArray(pageWords);
        const randomWordsForGame = shuffledPageWords.slice(0, roundsNumber);
        setWordsForGame(randomWordsForGame);
      };
      generateWordsForGame();
    }
  }, [pageWords, isGameFinished, roundsNumber]);

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
      <div className="gameSection">
        <h2>Audiocall</h2>
        <h2>User: {user.name}</h2>
        <h3>ID: {user.userId}</h3>
      </div>
      {!isGameStarted && !isGameFinished &&
      <>
        {!isStartedFromBook &&
        <DifficultySelector
          returnRandomWords={returnRandomWords}
          chosenGroup={chosenGroup}
        />}
        <Button text='Начать игру'
          classBtn='nextRound'
          onClick={() => {
            if (wordsForGame.length > 0) {
              setIsGameStarted(true);
            }
          }}/>
      </>
      }
      {!isGameFinished && isGameStarted &&
        <section className='gameSection'>
          {
            wordsForGame.length > 0 &&
            <div className='gameSection'>

              <div
                className='cardAudio'>
                <SoundButton
                  word= {wordsForGame[shownWordNumber]}
                  classBtn='audioBtn'
                  playFirstOnly
                />
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
                .catch(() => {
                  throw new Error('Cannot show next word');
                });
            }}
            simulatedButtonCode="Space"
          />

        </section>
      }
      {
        isGameFinished &&
        <section className='flex flex-col justify-center'>
          <h2>Game is finished!</h2>
          <GameResults correctAnswers={correctAnswers} wrongAnswers={wrongAnswers}/>
          <Button text='Начать сначала'
            classBtn='nextRound'
            onClick={gameReset}/>
        </section>}
    </main>
  );
}
