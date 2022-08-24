import axios, { AxiosError } from 'axios';

import { useEffect,useState } from 'react';

import { IWord } from '@/types/types';

export function useWords (){

  const [words, setWords] = useState<IWord[]>([]);
  const [page, setPage] = useState(1);
  const [group, setGroup] = useState(0);

  async function fetchWord (p?:number,g?:number ) {

    try {
      const response = await axios.get<IWord[]>(`https://rslang-team75.herokuapp.com/words?page=${p}&group=${g}`);
      setWords(response.data);

    } catch (e:unknown) {
      const error = e as AxiosError;
      console.log(error);
    }

  }
  async function getWords (p:number, g:number){
    setGroup(g);
    setPage(p);
    await fetchWord(p,g);

  }

  async function changePage (p:number) {
    setPage(p);
    await fetchWord(p,group);
  }

  // TODO: ошибка должна уйти, когда перенесем это в отдельную папку
  useEffect(()=>{
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchWord(page,group);
  },[group, page]);

  return { words,getWords,changePage,group };
}
