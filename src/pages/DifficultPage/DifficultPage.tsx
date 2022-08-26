/* eslint-disable no-underscore-dangle */
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useSelector } from 'react-redux';

import React, { useEffect, useState } from 'react';

import './DifficultPage.pcss';

import { CardWord } from '@/components/CardWord/CardWord';
import { Pagination } from '@/components/Pagination/Pagination';
import { IDifficult, IResponseAggregated, IWord } from '@/types/types';
import { RootState } from '@/utils/store/store';

export function DifficultPage (){

  const savedPageDifficult = Number(localStorage.getItem('currentPageDifficult'));

  const [words, setWords] = useState<IWord[]>([]);
  const [difficultWords, setDifficultWords] = useState<IDifficult[]>([]);
  const [page, setPage] = useState(savedPageDifficult || 0);
  const [totalPages, setTotalPages] = useState(0);

  const user = useSelector((state: RootState) => state.user);
  const SERVER_URL = 'https://rslang-team75.herokuapp.com';

  const wordsAxiosConfig: AxiosRequestConfig = {
    headers: {
      'Authorization': `Bearer ${user.token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  };

  async function fetchWord (p = 0) {
    try {
      const response = await axios.get<IResponseAggregated[]>(
        `${SERVER_URL}/users/${user.userId}/aggregatedWords?page=${p}&filter={"$and":[{"userWord.difficulty":"difficult"}]}`,
        wordsAxiosConfig);

      const responseDifficultWord = await axios.get<IDifficult[]>(
        `${SERVER_URL}/users/${user.userId}/words`,
        wordsAxiosConfig);

      setTotalPages(Math.ceil(response.data[0].totalCount[0].count/10)-1);
      setDifficultWords(responseDifficultWord.data);
      setWords(response.data[0].paginatedResults);

    } catch (e:unknown) {
      const error = e as AxiosError;
      console.log(error);
    }

  }

  // TODO: ошибка должна уйти, когда перенесем это в отдельную папку
  useEffect(()=>{
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchWord(page);
  },[page]);

  const handlePages = (value:number) => {
    setPage(value);
    localStorage.setItem('currentPageDifficult', value.toString());
  };
  return(
    <main>
      {!user.userId && <h1>Функция доступна только для авторизированных пользователей</h1>}
      {user.userId && <Pagination handlePages={handlePages} page = {page} totalPages={totalPages}/>}
      {user.userId && <div className='aggregatedWordsContainer'>
        {words.map(word=> <CardWord word={word}  difficultWords = {difficultWords}  key = {word._id}/>)}
      </div>}
    </main>

  );
}
