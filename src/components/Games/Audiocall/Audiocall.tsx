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

  const returnRandomWords = async (page: number, group: number): Promise<void> => {
    const randomWords = await randomWordsQuery(page, group);
    setPageWords(randomWords);
  };

  const generateWordsForGame = () => {
    const shuffledPageWords = pageWords.slice();
    for (let i = 0; i < shuffledPageWords.length; i += 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPageWords[i], shuffledPageWords[j]] =
        [shuffledPageWords[j], shuffledPageWords[i]];
    }
    const randomWordsForGame = shuffledPageWords.slice(10);
    setWordsForGame(randomWordsForGame);
    console.log(randomWordsForGame);
  };

  return(
    <main>
      <h1>Audiocall</h1>
      <p>User: {user.name}</p>
      <p>ID: {user.userId}</p>
      <DifficultySelector
        returnRandomWords={returnRandomWords}
      />
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
            /></div>
          <div>{wordsForGame[shownWordNumber].wordTranslate}</div>
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
