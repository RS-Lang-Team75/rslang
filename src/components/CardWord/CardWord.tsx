/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-misused-promises */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import parse from 'html-react-parser';
import { useSelector } from 'react-redux';

import React, { useEffect, useState } from 'react';

import './CardWord.pcss';

import { Button } from '../Button/Button';
import { SoundButton } from '../SoundButton/SoundButton';

import { IDifficult, IWord } from '@/types/types';
import { RootState } from '@/utils/store/store';

interface CardWordProps {
  word:IWord;
  difficultWords:IDifficult[];
  // difficultOff:boolean;
}

export function CardWord ({ word, difficultWords }:CardWordProps) : JSX.Element{
  const [difficult,setDifficult] = useState(false);
  const [studied,setStudied] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const wordsAxiosConfig: AxiosRequestConfig = {
    headers: {
      'Authorization': `Bearer ${user.token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const statusWordData:IDifficult = { difficulty: 'difficult',
    optional: {} };

  const sectionsBgColor = ['border-gray-500',
    'border-sky-500',
    'border-green-500',
    'border-yellow-500',
    'border-orange-500',
    'border-red-500',
    'border-purple-500' ];
  const cardIndicate = ['cardHeader', sectionsBgColor[word.group]];

  // console.log('word: ', word);

  async function postWordInDifficultData (): Promise<void> {
    try {
      const response = await axios.post<IDifficult>(
        `https://rslang-team75.herokuapp.com/users/${user.userId}/words/${word.id || word._id}`,
        statusWordData,
        wordsAxiosConfig,
      );
      console.log(response.data);

    }
    catch (e:unknown) {
      const error = e as AxiosError;
      console.log('post err: ', error);
    }

  }

  async function putWordInDifficultData (): Promise<void> {

    try {
      const response = await axios.put<IDifficult>(
        `https://rslang-team75.herokuapp.com/users/${user.userId}/words/${word.id || word._id}`,
        statusWordData,
        wordsAxiosConfig,
      );
      console.log(response.data);

    } catch (e:unknown) {
      const err = e as AxiosError;
      console.log('put err: ', err);
    }

  }
  async function getWordInDifficultData (){
    try {
      const response = await axios.get<IDifficult>(
        `https://rslang-team75.herokuapp.com/users/${user.userId}/words/${word.id || word._id}`,
        wordsAxiosConfig,
      );
      return response.data;

    } catch(e:unknown){
      const err = e as AxiosError;
      // console.log('get err: ', err);
      if(err.response){
        const res = err.response as AxiosResponse;
        if(res.status === 404 ){
          await postWordInDifficultData ();
        }
      }
      throw new Error(err.message);
    }
  }

  const addWordInDifficultData= async ()=>{
    try{
      statusWordData.difficulty = 'difficult';
      setDifficult(true);
      setStudied(false);
      await getWordInDifficultData();
      await putWordInDifficultData();
    }
    catch(e:unknown){
      const err = e as AxiosError;
      console.log('addWord: ', err);

    }
  };
  const addWordInStudiedData= async ()=>{
    try{
      statusWordData.difficulty = 'studied';
      setDifficult(false);
      setStudied(true);
      await getWordInDifficultData();
      await putWordInDifficultData();
    }
    catch(e:unknown){
      const err = e as AxiosError;
      console.log('addWord: ', err);

    }
  };
  function checkDifficultWords (){
    const some = difficultWords.filter(item=>item.wordId===word.id || item.wordId===word._id);
    if(some.length !== 0){
      if(some[0].difficulty==='difficult'){
        setDifficult(true);
      }else(setStudied(true));
    }
  }
  useEffect(()=>{

    checkDifficultWords();
  },[]);

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
