/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-misused-promises */
import parse from 'html-react-parser';
import { useSelector } from 'react-redux';

import React, { useEffect, useState } from 'react';

import './CardWord.pcss';

import { Button } from '../Button/Button';
import { SoundButton } from '../SoundButton/SoundButton';

import { IDifficulty, IWord } from '@/types/types';
import { getStudiedWords, updateOrCreateUserWordData } from '@/utils/queries/cardWordsQueries';
import { statisticsForStudiedWords } from '@/utils/queries/statisticQueries';
import { RootState } from '@/utils/store/store';

interface CardWordProps {
  word:IWord;
  difficultWords:IDifficulty[];
  studiedWordMessage:(w:boolean)=>void;
}

export function CardWord ({ word, difficultWords,studiedWordMessage }:CardWordProps) : JSX.Element{
  const [difficult,setDifficult] = useState(false);
  const [studied,setStudied] = useState(false);
  const [gameScore,setGameScore] = useState({ correct: 0, wrong: 0 });
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
    await updateOrCreateUserWordData(user, wordId, wordStatus);
    const studiedWords = await getStudiedWords(user,word.page,word.group);
    studiedWordMessage(studiedWords.length === 20);
    await statisticsForStudiedWords(user);
  };

  const addWordInStudiedData= async ():Promise<void> =>{
    const wordStatus = 'studied';
    setDifficult(false);
    setStudied(true);
    await updateOrCreateUserWordData(user, wordId, wordStatus);
    const studiedWords = await getStudiedWords(user,word.page,word.group);
    studiedWordMessage(studiedWords.length === 20);
    await statisticsForStudiedWords(user);
  };

  useEffect(()=>{
    function checkDifficultWords (){
      const userWordData:IDifficulty[] = difficultWords.filter(item=>item.wordId === wordId);
      if(userWordData.length !== 0){
        if(userWordData[0].difficulty==='difficult'){setDifficult(true);}
        if(userWordData[0].difficulty==='studied'){setStudied(true);}
        if(userWordData[0].optional){
          setGameScore(userWordData[0].optional.allGames);};
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
        { user.userId && <div className= 'pt-4'>
          <p>{`В играх слово было угаданно: ${gameScore.correct},  не было угадано: ${gameScore.wrong}`}</p>
        </div>}
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
