import axios, { AxiosError } from 'axios';

import React, { useEffect,useState } from 'react';

import { IWord } from '@/types/types';

export function useWords (){

  const [words, setWords] = useState<IWord[]>([]);

  async function fetchWord (group = 0, page=0) {
    try {
      const response = await axios.get<IWord[]>(`https://rslang-team75.herokuapp.com/words?page=${page}&group=${group}`);
      setWords(response.data);

    } catch (e:unknown) {
      const error = e as AxiosError;
      console.log(error);
    }

  }
  function getWords (g:number,p:number){
    fetchWord (g,p);
  }

  useEffect(()=>{
    fetchWord(); // TODO: ошибка должна уйти, когда перенесем это в отдельную папку
  },[]);

  return { words,getWords };
}
