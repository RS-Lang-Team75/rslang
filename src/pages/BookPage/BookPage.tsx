import axios, { AxiosError } from 'axios';

import React, { useEffect, useState } from 'react';

import { CardWord } from '@/components/CardWord/CardWord';
import { IWord } from '@/types/types';

export function BookPage (){
  const [words, setWords] = useState<IWord[]>([]);

  async function fetchWord () {
    try {
      const response = await axios.get<IWord[]>('https://rslang-team75.herokuapp.com/words?page=1');
      setWords(response.data);

    } catch (e:unknown) {
      const error = e as AxiosError;
      console.log(error);
    }

  }

  useEffect(()=>{
    fetchWord(); // TODO: ошибка должна уйти, когда перенесем это в отдельную папку
  },[]);

  return(
    <main >
      <h2 className="text-center font-serif  uppercase text-4xl xl:text-5xl">Book Page</h2>

      {words.map(word=> <CardWord word={word} key = {word.id}/>)}

    </main>

  );
}
