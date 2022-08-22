import parse from 'html-react-parser';

import React, { useState } from 'react';

import './CardWord.pcss';

import { Button } from '../Button/Button';
import { SoundButton } from '../Button/SoundButton';

import { IWord } from '@/types/types';

interface CardWordProps {
  word:IWord;
}

export function CardWord ({ word }:CardWordProps) : JSX.Element{
  const [activeBtn, setActiveBtn] = useState(false);
  // TODO: состояния будет менять, когда появится зарегистрированный пользователь
  return (
    <div className='cardWords'>
      <div className="imgInCard"
        style={{ backgroundImage: `url(https://rslang-team75.herokuapp.com/${word.image})` }}
        title={word.word} />
      <div className='cardContent'>
        <div className='cardHeader'>
          <div className='cardWordPart'>
            <div className='cardWord'>
              <div className='cardWordOnEnglish'>{word.word}</div>
              <div className='cardWordOnTranscription'>
                {word.transcription}</div>
            </div>
            <div className='cardWordOnRussian'>
              {word.wordTranslate}
            </div>
          </div>
          <div className='cardAudio'>
            <SoundButton
              soundUrl={`https://rslang-team75.herokuapp.com/${word.audio}` }
              classBtn='audioBtn'/>
          </div>
        </div>
        <div className='cardMeaning'>
          <p className='cardMeaningEnglish'>{parse(word.textMeaning)}</p>
          <p className='cardMeaningRussian'>{word.textMeaningTranslate}</p>
        </div>
        <div className='cardExample'>
          <p className='cardExampleEnglish'>{parse(word.textExample)}</p>
          <p className='cardExampleRussian'>{word.textExampleTranslate}</p>
        </div>
        { activeBtn &&
        <div className='cardButton'>
          <Button text="Сложное" classBtn='difficult'/>
          <Button text="Выученное" classBtn='studied'/>
        </div>
        }
      </div>

    </div>

  );
}
