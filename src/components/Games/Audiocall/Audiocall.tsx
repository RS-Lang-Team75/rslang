import { useSelector } from 'react-redux';

import React, { useState } from 'react';

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

  const user = useSelector((state: RootState) => state.user);

  function shuffleArray<T> (arr: Array<T>): Array<T> {
    const shuffledArray = arr.slice();
    for (let i = 0; i < shuffledArray.length; i += 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  const generateWordsForGame = (): void => {
    const shuffledPageWords = shuffleArray(pageWords);
    const randomWordsForGame = shuffledPageWords.slice(10);
    setWordsForGame(randomWordsForGame);
  };

  const returnRandomWords = async (page: number, group: number): Promise<void> => {
    const randomWords = await randomWordsQuery(page, group);
    setPageWords(randomWords);
  };

  const generateAnswers = (word: IWord): string[] => {
    const answers = [word.wordTranslate];
    while (answers.length < 5) {
      const ind = Math.floor(Math.random() * pageWords.length);
      if (pageWords[ind].wordTranslate !== word.wordTranslate) {
        answers.push(pageWords[ind].wordTranslate);
      }
    }
    console.log(answers);
    return answers;
  };

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
          text='Generate random'
          classBtn='nextBtn'
          onClick={() => generateWordsForGame()}/>

        <Button
          text='Next'
          classBtn='nextBtn'
          onClick={() =>
            shownWordNumber < wordsForGame.length - 1 ? setShownWordNumber(n => n + 1) : setShownWordNumber(0)}/>

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
          <div>{wordsForGame[shownWordNumber].wordTranslate}</div>
          <div className='answerBtnContainer'>
            {
              shuffleArray(generateAnswers(wordsForGame[shownWordNumber])).map((w,i) =>
                <div className='answerBtn'
                  key={`${w.charCodeAt(0).toString(16)}${i*1}`}>{w}</div>)
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
