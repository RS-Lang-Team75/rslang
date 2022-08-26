import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useSelector } from 'react-redux';

import { useEffect, useState } from 'react';

import './BookPage.pcss';
import { CardWord } from '@/components/CardWord/CardWord';
import { Pagination } from '@/components/Pagination/Pagination';
import { SideBar } from '@/components/SideBar/SideBar';
import { IDifficult, IWord } from '@/types/types';
import { RootState } from '@/utils/store/store';

export function BookPage () : JSX.Element{

  const savedPage = Number(localStorage.getItem('currentPage'));
  const savedGroup = Number(localStorage.getItem('currentGroup'));

  const [words, setWords] = useState<IWord[]>([]);
  const [difficultWords, setDifficultWords] = useState<IDifficult[]>([]);
  const [page, setPage] = useState(savedPage || 0);
  const [group, setGroup] = useState(savedGroup || 0);

  const user = useSelector((state: RootState) => state.user);
  const SERVER_URL = 'https://rslang-team75.herokuapp.com';
  const TOTAL_PAGES = 29;

  const wordsAxiosConfig: AxiosRequestConfig = {
    headers: {
      'Authorization': `Bearer ${user.token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  };

  async function fetchWord (p = 0,g = 0 ) {

    try {
      const response = await axios.get<IWord[]>(`${SERVER_URL}/words?page=${p}&group=${g}`);
      if(user.userId){
        const responseDifficultWord = await axios.get<IDifficult[]>(
          `${SERVER_URL}/users/${user.userId}/words`,
          wordsAxiosConfig);
        setDifficultWords(responseDifficultWord.data);
      }else{setDifficultWords([]);}
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
      <Pagination handlePages={handlePages} page = {page} totalPages={TOTAL_PAGES}/>
      <div className='PageMainContent'>
        <SideBar onChange={handleChangeGroup}/>
        <div className='wordsContainer'>
          {words.map(word=> <CardWord word={word}  difficultWords = {difficultWords} key = {word.id}/>)}
        </div>
      </div>
    </main>

  );
}
