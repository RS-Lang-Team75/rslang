import { useSelector } from 'react-redux';

import React, { useEffect, useState } from 'react';

import { DifficultySelector } from '../DifficultySelector/DifficultySelector';
import { GameButton } from '../GameButton/GameButton';
import { GameResults } from '../GameResults/GameResults';

import { Button } from '@/components/Button/Button';
import { SoundButton } from '@/components/SoundButton/SoundButton';
import { IWord } from '@/types/types';
import { updateOrCreateUserWordData, getWordsQuery } from '@/utils/queries/cardWordsQueries';
import { RootState } from '@/utils/store/store';

import './Audioсall.pcss';

interface IAudioCall {
  wordsArray?: IWord[];
}

export default function Audioсall (props: IAudioCall) {

  const gameName = 'audiocall';

  const { wordsArray } = props;

  const [pageWords, setPageWords] = useState<IWord[] | []>(wordsArray || []);
  const [wordsForGame, setWordsForGame] = useState<IWord[] | []>([]);
  const [correctAnswers, setCorrectAnswers] = useState<IWord[] | []>([]);
  const [wrongAnswers, setWrongAnswers] = useState<IWord[] | []>([]);

  const [shownWordNumber, setShownWordNumber] = useState<number>(0);

  const [isAnswerGiven, setIsAnswerGiven] = useState<boolean>(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean>(false);
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  const [possibleAnswers, setPossibleAnswers] = useState<string[] | []>([]);

  const user = useSelector((state: RootState) => state.user);

  function shuffleArray<T> (arr: Array<T>): Array<T> {
    const shuffledArray = arr.slice();
    for (let i = 0; i < shuffledArray.length; i += 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  const returnRandomWords = async (page: number, group: number): Promise<void> => {
    const randomWords = await getWordsQuery(page, group);
    setPageWords(randomWords);
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
    return !isAnswerGiven ? additionalClass : '';
  };

  const revealOrNext = () => {
    if (isAnswerGiven) {
      if (shownWordNumber < wordsForGame.length - 1) {
        setShownWordNumber(n => n + 1);
      } else {
        setShownWordNumber(0);
        setIsGameFinished(true);
      }
      setIsAnswerGiven(false);
      setIsCorrectAnswer(false);
    } else {
      setIsAnswerGiven(true);
      setWrongAnswers([...wrongAnswers, wordsForGame[shownWordNumber]]);
    }
  };

  useEffect(() => {
    if (pageWords.length > 0 && !isGameFinished) {
      const generateWordsForGame = (): void => {
        const shuffledPageWords = shuffleArray(pageWords);
        const randomWordsForGame = shuffledPageWords.slice(10);
        setWordsForGame(randomWordsForGame);
      };
      generateWordsForGame();
    }
  }, [pageWords, isGameFinished]);

  useEffect(() => {
    const generateAnswers = (word: IWord): void => {
      const answers = [word.wordTranslate];
      while (answers.length < 5) {
        const ind = Math.floor(Math.random() * pageWords.length);
        if (pageWords[ind].wordTranslate !== word.wordTranslate) {
          answers.push(pageWords[ind].wordTranslate);
        }
      }
      setPossibleAnswers(shuffleArray(answers));
    };

    if (wordsForGame.length > 0) {
      generateAnswers(wordsForGame[shownWordNumber]);
    }
  }, [wordsForGame, shownWordNumber, pageWords]);

  return(
    <main className='gamesPage'>
      <div className="gameSection">
        <h2>Audiocall</h2>
        <h2>User: {user.name}</h2>
        <h3>ID: {user.userId}</h3>
      </div>
      {pageWords.length === 0 &&
      <DifficultySelector
        returnRandomWords={returnRandomWords}
      />
      }
      {!isGameFinished && pageWords.length > 0 &&
      <section className='gameSection'>
        {
          wordsForGame.length > 0 &&
            <div className='gameSection'>
              <div className='cardAudio'>
                <SoundButton
                  word= {wordsForGame[shownWordNumber]}
                  classBtn='audioBtn'
                  playFirstOnly
                /></div>

              <div className="answerContainer">
                {isAnswerGiven && <div className= {isCorrectAnswer ? 'answerCorrect' : 'answerIncorrect'}>
                  {wordsForGame[shownWordNumber].wordTranslate}
                </div>}
              </div>

              <div className='answerImg'
                style={isAnswerGiven ?
                  { backgroundImage: `url(https://rslang-team75.herokuapp.com/${wordsForGame[shownWordNumber].image})` } : {}}/>

              <div className='answerBtnContainer'>
                {
                  possibleAnswers.map((w,i) =>
                    <GameButton classBtn='answerBtn activeAnswerBtn'
                      key={`${w.charCodeAt(0).toString(16)}${shownWordNumber}${i*1}`}
                      id={`${i+1}`}
                      onClick={e => {
                        if (!isAnswerGiven) {
                          e.currentTarget.classList.add(checkAnswer(Number(e.currentTarget.id)));
                          e.currentTarget.classList.remove('activeAnswerBtn');
                        }
                      }}
                      text={`${i+1}. ${w}`}
                      simulatedButtonCode={`Digit${i+1}`}/>)
                }
              </div>
            </div>
        }
        <GameButton
          text={isAnswerGiven ? 'далее' : 'не знаю'}
          classBtn='nextRound'
          onClick={revealOrNext}
          simulatedButtonCode="Space"/>
      </section>}
      {isGameFinished && <section className='flex flex-col justify-center'>
        <h2>Game is finished!</h2>
        <GameResults correctAnswers={correctAnswers} wrongAnswers={wrongAnswers}/>
        <Button text='Начать сначала'
          classBtn='nextBtn'
          onClick={() => {
            setIsGameFinished(false);
            setIsAnswerGiven(false);
            setCorrectAnswers([]);
            setWrongAnswers([]);
            setShownWordNumber(0);
          }}/>
      </section>}
    </main>
  );
}
