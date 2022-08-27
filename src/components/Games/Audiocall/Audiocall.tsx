import { useSelector } from 'react-redux';

import React, { FormEvent, useEffect, useState } from 'react';

import { DifficultySelector } from '../DifficultySelector/DifficultySelector';

import { Button } from '@/components/Button/Button';
import { SoundButton } from '@/components/Button/SoundButton';
import { IWord } from '@/types/types';
import { randomWordsQuery } from '@/utils/queries/wordsQueries';
import { RootState } from '@/utils/store/store';

import './AudioCall.pcss';

interface IAudioCall {
  wordsArray?: IWord[];
}

export default function AudioCall (props: IAudioCall) {

  const { wordsArray } = props;

  const [pageWords, setPageWords] = useState<IWord[] | []>(wordsArray || []);
  const [wordsForGame, setWordsForGame] = useState<IWord[] | []>([]);
  const [shownWordNumber, setShownWordNumber] = useState<number>(0);

  const [isAnswerGiven, setIsAnswerGiven] = useState<boolean>(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean>(false);
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
    const randomWords = await randomWordsQuery(page, group);
    setPageWords(randomWords);
  };

  const checkAnswer = (e: FormEvent): void => {
    e.preventDefault();
    if (!isAnswerGiven) {
      if (e.currentTarget.innerHTML === wordsForGame[shownWordNumber].wordTranslate) {
        setIsCorrectAnswer(true);
        e.currentTarget.classList.add('bg-green-400');
      } else {
        setIsCorrectAnswer(false);
        e.currentTarget.classList.add('bg-red-400');
      }
      e.currentTarget.classList.remove('activeAnswerBtn');
      setIsAnswerGiven(true);
    }
  };

  useEffect(() => {
    const generateWordsForGame = (): void => {
      const shuffledPageWords = shuffleArray(pageWords);
      const randomWordsForGame = shuffledPageWords.slice(10);
      setWordsForGame(randomWordsForGame);
    };
    generateWordsForGame();
  }, [pageWords]);

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
    <main>
      <h1>Audiocall</h1>
      <p>User: {user.name}</p>
      <p>ID: {user.userId}</p>
      {pageWords.length === 0 &&
      <DifficultySelector
        returnRandomWords={returnRandomWords}
      />
      }
      {pageWords.length > 0 &&
      <section className='gameSection'>

        <Button
          text='Next'
          classBtn='nextBtn'
          onClick={() => {
            if (shownWordNumber < wordsForGame.length - 1) {
              setShownWordNumber(n => n + 1);
            } else {
              setShownWordNumber(0);
            }
            setIsAnswerGiven(false);
            setIsCorrectAnswer(false);
          }
          }/>

      </section>
      }
      {wordsForGame.length > 0 &&
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
                <button className='answerBtn activeAnswerBtn'
                  type='button'
                  key={`${w.charCodeAt(0).toString(16)}${i*1}`}
                  onClick={checkAnswer}>{w}</button>)
            }
          </div>
        </div>
      }
      {pageWords.length > 0 && <div className='gameSection temp'>
        <h2>Слова, с которыми проходит игра</h2>
        <div className="temp-word-cont">
          {pageWords.map(w =>
            <p key={w.id} className='temp-word'> {w.word} </p>,
          )}
        </div>
      </div>}

    </main>
  );
}
