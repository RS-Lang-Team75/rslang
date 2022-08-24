import axios, { AxiosError } from 'axios';

import { useEffect, useState } from 'react';

import { CardWord } from '@/components/CardWord/CardWord';
import { Pagination } from '@/components/Pagination/Pagination';
import { SideBar } from '@/components/SideBar/SideBar';
import { IWord } from '@/types/types';

import './BookPage.pcss';

export function BookPage () : JSX.Element{

  const savedPage = Number(localStorage.getItem('currentPage'));
  const savedGroup = Number(localStorage.getItem('currentGroup'));

  const [words, setWords] = useState<IWord[]>([]);
  const [page, setPage] = useState(savedPage || 0);
  const [group, setGroup] = useState(savedGroup || 0);

  async function fetchWord (p = 0,g = 0 ) {

    try {
      const response = await axios.get<IWord[]>(`https://rslang-team75.herokuapp.com/words?page=${p}&group=${g}`);
      setWords(response.data);

    } catch (e:unknown) {
      const error = e as AxiosError;
      console.log(error);
    }

  }

  // TODO: ошибка должна уйти, когда перенесем это в отдельную папку
  useEffect(()=>{
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchWord(page,group);
  },[group, page]);

  const PAGE_ONE = 0;

  const  handleChangeGroup = (value:number)=>{
    setPage(PAGE_ONE);
    setGroup(value);
    localStorage.setItem('currentGroup', value.toString());
    localStorage.setItem('currentPage', PAGE_ONE.toString());
  };

  const handlePages = (value:number) => {
    setPage(value);
    localStorage.setItem('currentPage', value.toString());
  };

  return(
    <main className='bookPageMain'>
      <Pagination handlePages={handlePages} page = {page}/>
      <div className='PageMainContent'>
        <SideBar onChange={handleChangeGroup}/>
        <div>
          {words.map(word=> <CardWord word={word} key = {word.id}/>)}
        </div>
      </div>
    </main>

  );
}
