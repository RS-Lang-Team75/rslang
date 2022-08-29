/* eslint-disable no-underscore-dangle */
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useSelector } from 'react-redux';

import { useEffect, useState } from 'react';

import './BookPage.pcss';
import { CardWord } from '@/components/CardWord/CardWord';
import { Pagination } from '@/components/Pagination/Pagination';
import { SideBar } from '@/components/SideBar/SideBar';
import { IDifficulty, IResponseAggregated, IWord } from '@/types/types';
import { RootState } from '@/utils/store/store';

export function BookPage () : JSX.Element{

  const savedPage = Number(localStorage.getItem('currentPage'));
  const savedGroup = Number(localStorage.getItem('currentGroup'));

  const [words, setWords] = useState<IWord[]>([]);
  const [difficultWords, setDifficultWords] = useState<IDifficulty[]>([]);
  const [page, setPage] = useState(savedPage || 0);
  const [group, setGroup] = useState(savedGroup || 0);
  const[isGroupSix, setIsGroupSix] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const user = useSelector((state: RootState) => state.user);
  const SERVER_URL = 'https://rslang-team75.herokuapp.com';
  const TOTAL_PAGES = 29;

  // TODO: ошибка no-floating-promises не решена
  useEffect(()=>{
    const wordsAxiosConfig: AxiosRequestConfig = {
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };

    const getDataDifficultWords = async (): Promise<void> => {
      const responseDifficultWord = await axios.get<IDifficulty[]>(
        `${SERVER_URL}/users/${user.userId}/words`,
        wordsAxiosConfig);
      setDifficultWords(responseDifficultWord.data);
    };

    async function fetchWord (p = 0,g = 0 ) {
      try {
        if (g === 6 ){setIsGroupSix(true);}
        if(g === 6 && user.userId){
          const response = await axios.get<IResponseAggregated[]>(
            `${SERVER_URL}/users/${user.userId}/aggregatedWords?page=${p}&filter={"$and":[{"userWord.difficulty":"difficult"}]}`,
            wordsAxiosConfig);
          await getDataDifficultWords();
          setTotalPages(Math.ceil(response.data[0].totalCount[0].count/10)-1);
          setWords(response.data[0].paginatedResults);
        }else{
          const response = await axios.get<IWord[]>(`${SERVER_URL}/words?page=${p}&group=${g}`);
          if(g !== 6 ) {setTotalPages(TOTAL_PAGES);}else{setTotalPages(0);}
          if(user.userId){
            await getDataDifficultWords();
          }
          setWords(response.data);
        }

      } catch (e:unknown) {
        const error = e as AxiosError;
        console.log(error);
      }

    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchWord(page,group);
  },[group, page, user.token, user.userId]);

  const PAGE_ONE = 0;

  const  handleChangeGroup = (value:number)=>{
    setIsGroupSix(false);
    setPage(PAGE_ONE);
    setGroup(value);
    if (value === 6 ){setIsGroupSix(true);}
    localStorage.setItem('currentGroup', value.toString());
    localStorage.setItem('currentPage', PAGE_ONE.toString());
  };

  const handlePages = (value:number) => {
    setPage(value);
    localStorage.setItem('currentPage', value.toString());
  };

  return(
    <main className='bookPageMain'>
      <Pagination handlePages={handlePages} page = {page} totalPages={totalPages}/>
      <div className='PageMainContent'>
        <SideBar onChange={handleChangeGroup}/>
        <div className='wordsContainer'>
          {!user.userId && isGroupSix && <h1 className='message'>Возможность добавления сложных слов доступна только для авторизированных пользователей</h1>}
          {words.map(word=> <CardWord word={word}  difficultWords = {difficultWords} key = {word.id || word._id}/>)}
        </div>
      </div>
    </main>

  );
}
