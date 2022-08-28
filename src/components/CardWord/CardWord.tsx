/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-misused-promises */
import parse from 'html-react-parser';
import { useSelector } from 'react-redux';

import React, { useEffect, useState } from 'react';

import './CardWord.pcss';

import { Button } from '../Button/Button';
import { SoundButton } from '../SoundButton/SoundButton';

import { IDifficult, IWord } from '@/types/types';
import { getWordInDifficultData, putWordInDifficultData } from '@/utils/queries/cardWordsQueries';
import { RootState } from '@/utils/store/store';

interface CardWordProps {
  word:IWord;
  difficultWords:IDifficult[];
}

export function CardWord ({ word, difficultWords }:CardWordProps) : JSX.Element{
  const [difficult,setDifficult] = useState(false);
  const [studied,setStudied] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const  wordId = word.id || word._id;

  const sectionsBgColor = ['border-gray-500',
    'border-sky-500',
    'border-green-500',
    'border-yellow-500',
    'border-orange-500',
    'border-red-500',
    'border-purple-500' ];
  const cardIndicate = ['cardHeader', sectionsBgColor[word.group]];

  const addWordInDifficultData= async ():Promise<void>=>{
    const wordStatus = 'difficult';
    setDifficult(true);
    setStudied(false);
    await getWordInDifficultData(user, wordStatus, wordId);
    await putWordInDifficultData(user, wordStatus, wordId);

  };

  const addWordInStudiedData= async ():Promise<void> =>{
    const wordStatus = 'studied';
    setDifficult(false);
    setStudied(true);
    await getWordInDifficultData(user, wordStatus, wordId);
    await putWordInDifficultData(user, wordStatus, wordId);

  };

  useEffect(()=>{
    function checkDifficultWords (){
      const some = difficultWords.filter(item=>item.wordId === wordId);
      if(some.length !== 0){
        if(some[0].difficulty==='difficult'){
          setDifficult(true);
        }else(setStudied(true));
      }
    }
    checkDifficultWords();
  },[difficultWords, user.userId, wordId]);

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
              word= {word}
              classBtn='audioBtn'
            />
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
          <Button
            text= 'Сложное'
            classBtn={!difficult ? 'difficult': 'difficult difficultChosen'}
            disabled = {difficult}
            onClick={addWordInDifficultData}

          />
          <Button
            text="Выученное"
            classBtn= {!studied ? 'studied': 'studied studiedChosen'}
            disabled= {studied}
            onClick={addWordInStudiedData}/>
        </div>
        }
      </div>

    </div>

  );
}
