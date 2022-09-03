/* eslint-disable no-underscore-dangle */
import axios, { AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { useEffect, useState } from 'react';

import './BookPage.pcss';
import { CardWord } from '@/components/CardWord/CardWord';
import { Pagination } from '@/components/Pagination/Pagination';
import { SideBar } from '@/components/SideBar/SideBar';
import { IResponseAggregated, IWord } from '@/types/types';
import { SERVER_URL } from '@/utils/queries/url';
import { RootState } from '@/utils/store/store';

export function BookPage () : JSX.Element{

  const savedPage = Number(localStorage.getItem('currentPage'));
  const savedGroup = Number(localStorage.getItem('currentGroup'));

  const [words, setWords] = useState<IWord[]>([]);
  const [difficultWords, setDifficultWords] = useState<IWord[]>([]);
  const [page, setPage] = useState<number>(savedPage || 0);
  const [group, setGroup] = useState<number>(savedGroup || 0);
  const [isGroupSix, setIsGroupSix] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageStudied, setPageStudied] = useState<boolean>(false);

  const user = useSelector((state: RootState) => state.user);
  const PAGE_ONE = 0;
  const TOTAL_PAGES = 29;

  useEffect(() => {
    const wordsAxiosConfig: AxiosRequestConfig = {
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };

    const getDataDifficultWords = async (pageDif:number, groupDif:number): Promise<IWord[]> => {
      const response = await axios.get<IResponseAggregated[]>(
        `${SERVER_URL}/users/${user.userId}/aggregatedWords?group=${groupDif}&filter={"$and":[{"page":${pageDif}},{"$or":[{"userWord.difficulty":"studied"},{"userWord.difficulty":"difficult"},{"userWord.difficulty":"learning"}]}]}`,
        wordsAxiosConfig);
      return response.data[0].paginatedResults;
    };

    async function fetchWord (p = 0, g = 0) {
      try {
        if (g === 6) {
          setIsGroupSix(true);
        }
        if (g === 6 && user.userId) {
          const response = await axios.get<IResponseAggregated[]>(
            `${SERVER_URL}/users/${user.userId}/aggregatedWords?page=${p}&filter={"$and":[{"userWord.difficulty":"difficult"}]}`,
            wordsAxiosConfig);

          const diffWords = response.data[0].paginatedResults;

          setTotalPages(Math.ceil(response.data[0].totalCount[0].count / 20) - 1);

          setDifficultWords(diffWords);
          setWords(diffWords);
          setPageStudied(false);
        }
        else {
          const response = await axios.get<IWord[]>(`${SERVER_URL}/words?page=${p}&group=${g}`);
          if (g !== 6) {
            setTotalPages(TOTAL_PAGES);
          } else {
            setTotalPages(0);
          }
          if (user.userId) {
            const wordsInProgress = await getDataDifficultWords(p, g);
            setDifficultWords(wordsInProgress);
            const studiedWords = wordsInProgress.filter(item => item.userWord?.difficulty === 'studied');
            setPageStudied(studiedWords.length === 20);
          }
          setWords(response.data);
        }

      } catch (e:unknown) {
        const err = e as AxiosError;
        throw new Error(err.message);
      }

    }

    fetchWord(page,group).catch(() => {
      throw new Error('Cannot get words');
    });
  }, [group, page, user, user.token, user.userId]);

  const  handleChangeGroup = (value:number)=>{
    setIsGroupSix(false);
    setPage(PAGE_ONE);
    setGroup(value);
    if (value === 6 ) {
      setIsGroupSix(true);
    }
    localStorage.setItem('currentGroup', value.toString());
    localStorage.setItem('currentPage', PAGE_ONE.toString());
  };

  const handlePages = (value:number) => {
    setPage(value);
    localStorage.setItem('currentPage', value.toString());
  };

  const handleChangeStudiedWordMessage = (value:boolean)=>{
    setPageStudied(value);
  };

  return(
    <main className='bookPageMain'>
      <Pagination
        handlePages={handlePages}
        page={page}
        totalPages={totalPages}
      />
      <div className='PageMainContent'>

        <aside className="stickyContainer">
          <div className="asideMenuContainer">
            <SideBar onChange={handleChangeGroup}/>
            <Link
              key='audiocallLink'
              to='/audiocall'
              className={pageStudied ? 'gameLink disabledLink' :'gameLink' }
              state={{
                unstudiedWords: words.filter(w =>
                  !difficultWords.find(dw => dw._id === w.id && dw.userWord?.difficulty === 'studied')),
                allWordsFromPage: words,
              }}
            >Попробовать Аудиовызов</Link>

            <Link
              key='sprintLink'
              to='/sprint'
              className={pageStudied ? 'gameLink disabledLink' :'gameLink' }
              state={{
                unstudiedWords: words.filter(w =>
                  !difficultWords.find(dw => dw._id === (w.id || w._id) && dw.userWord?.difficulty === 'studied')),
                pageFromBook: page,
                groupFromBook: group,
              }}
            >Попробовать Спринт</Link>
          </div>
        </aside>

        <div className='wordsContainer'>
          {!user.userId && isGroupSix && <h1 className='message'>Возможность добавления сложных слов доступна только для авторизированных пользователей</h1>}
          {user.userId && pageStudied && !isGroupSix && <h2 className='messageCongratulation'>&#128165;Поздравляю!!!&#128165; <br/> Все слова на этой странице изучены!!!</h2>}
          {words.map(word =>
            <CardWord
              word={word}
              difficultWords={difficultWords}
              studiedWordMessage={handleChangeStudiedWordMessage}
              key = {word.id || word._id}/>)}
        </div>
      </div>
    </main>

  );
}
