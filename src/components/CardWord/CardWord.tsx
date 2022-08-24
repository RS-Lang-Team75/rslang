import parse from 'html-react-parser';
import { useSelector } from 'react-redux';

import React from 'react';

import './CardWord.pcss';

import { Button } from '../Button/Button';
import { SoundButton } from '../Button/SoundButton';

import { IWord } from '@/types/types';
import { RootState } from '@/utils/store/store';

interface CardWordProps {
  word:IWord;
}

export function CardWord ({ word }:CardWordProps) : JSX.Element{
  // TODO: состояния будет менять, когда появится зарегистрированный пользователь
  const user = useSelector((state: RootState) => state.user);

  const sectionsBgColor = ['gray','sky','green','yellow','orange','red' ,'purple' ];
  const cardIndicate = ['cardHeader', `border-l-${sectionsBgColor[word.group]}-500`];

  return (
    <div className='cardWords'>
      <div className= {user.userId ? 'imgInCardAutorisate' : 'imgInCard'}
        style={{ backgroundImage: `url(https://rslang-team75.herokuapp.com/${word.image})` }}
        title={word.word} />
      <div className='cardContent'>
        <div className={cardIndicate.join(' ')}>
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
        { user.userId &&
        <div className='cardButton'>
          <Button text="Сложное" classBtn='difficult'/>
          <Button text="Выученное" classBtn='studied'/>
        </div>
        }
      </div>

    </div>

  );
}
