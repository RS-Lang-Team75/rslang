import axios, { AxiosError, AxiosResponse } from 'axios';
import { useSelector } from 'react-redux';

import { useEffect, useState } from 'react';

import { CardStatistics } from '@/components/CardStatistics/CardStatistics';
import { ChartStatistic } from '@/components/Charts/ChartStatistic/ChartStatistic';
import { Footer } from '@/components/Footer/Footer';
import { StatisticsByDay, UserStatistics } from '@/types/types';
import { setAxiosConfig } from '@/utils/queries/headers';
import { getDate } from '@/utils/queries/statisticQueries';
import { SERVER_URL } from '@/utils/queries/url';
import { RootState } from '@/utils/store/store';
import './StatisticsPage.pcss';
import { InitialDailyStatistics, LocalDailyStatistics } from '@/utils/todayStats';

export function StatisticsPage (){

  const [learnedLongData, setLearnedLongData] = useState<StatisticsByDay[]>([]);
  const [learnedByDayData, setLearnedByDayData] = useState<StatisticsByDay[]>([]);
  const [newWordsData, setNewWordsData] = useState<StatisticsByDay[]>([]);

  const [noNewWords, setNoNewWords] = useState<boolean>(false);
  const [noLearnedByDay, setNoLearnedByDay] = useState<boolean>(false);
  const today = getDate();

  const user = useSelector((state: RootState) => state.user);

  const gameStatistic = localStorage.getItem(`${user.userId}stats`);

  const gameStatisticParse:LocalDailyStatistics =
      gameStatistic
        ? JSON.parse(gameStatistic) as LocalDailyStatistics
        : InitialDailyStatistics;

  const gameStatisticData:LocalDailyStatistics =
  gameStatisticParse.date === today
    ? gameStatisticParse
    : InitialDailyStatistics;

  const { games } = gameStatisticData;

  useEffect(()=>{

    const getStatistics = async () => {
      try {

        const response = await axios.get<UserStatistics>(
          `${SERVER_URL}/users/${user.userId}/statistics`,
          setAxiosConfig(user.token));

        const { optional } = response.data;
        const learnedLongParse:StatisticsByDay[] =
        optional.stateLearnedLong
          ? JSON.parse(optional.stateLearnedLong) as StatisticsByDay[]
          : [];
        setLearnedLongData(learnedLongParse);

        const learnedByDayParse:StatisticsByDay[] =
        optional.stateLearnedByDay
          ? JSON.parse(optional.stateLearnedByDay) as StatisticsByDay[]
          : [];
        setLearnedByDayData(learnedByDayParse);
        setNoLearnedByDay(learnedByDayParse.slice(-1)[0]?.date === today);

        const newWordsDataParse:StatisticsByDay[] =
        optional.stateNewWords
          ?  JSON.parse(optional.stateNewWords) as StatisticsByDay[]
          :[];
        setNewWordsData(newWordsDataParse);
        setNoNewWords(newWordsDataParse.slice(-1)[0]?.date === today);

      } catch (e:unknown) {
        const err = e as AxiosError;
        if (err.response) {
          const res = err.response as AxiosResponse;
          if (res.status === 404) {
            // setLearnedLongData([]);
            // setLearnedByDayData([]);
            // setNewWordsData([]);
            setLearnedLongData([{ date:`${today}`, learnedWordsLong:0 }]);
            setLearnedByDayData([{ date:`${today}`, learnedWordsByDay:0 }]);
            setNewWordsData([{ date:`${today}`, newWords:0 }]);
          }
        }
        else {
          throw new Error(`GET statisticsPage query error, ${err.message}`);
        }
      }
    };

    getStatistics().catch(() => {
      throw new Error('Cannot get statistics');
    });

  },[today, user]);

  return(
<>
    <main>

      {!user.userId && <h1 className='message'>Статистика доступна только для авторизированных пользователей</h1>}
      {user.userId &&
     (<CardStatistics
       title='Статистика по всем словам'
       numUpLine = {
         noNewWords
           ? newWordsData.slice(-1)[0].newWords
           : 0
       }
       textUpLine = 'Новых слов за сегодня'
       numDownLine = {
         noLearnedByDay
           ? learnedByDayData.slice(-1)[0].learnedWordsByDay
           : 0
       }
       textDownLine = 'Изученных слов за сегодня'
       correct = {gameStatisticData.allCorrect}
       wrong = {gameStatisticData.allWrong}
       numPercent = {gameStatisticData.allPercent}
       textPercent = 'верных ответов'
     />)}
      {user.userId &&
      (<div className='flex flex-nowrap sm:flex-col'>
        <CardStatistics
          title='Игра "Аудиовызов"'
          numUpLine = {games.audiocall.correct}
          textUpLine  ='Верных ответов'
          numDownLine = {games.audiocall.wrong}
          textDownLine = 'Неверных ответов'
          correct = {games.audiocall.correct}
          wrong= {games.audiocall.wrong}
          numPercent = {games.audiocall.correctPercent}
          textPercent = 'верных ответов'
        />
        <CardStatistics
          title='Игра "Спринт"'
          numUpLine = {games.sprint.correct}
          textUpLine  ='Верных ответов'
          numDownLine = {games.sprint.wrong}
          textDownLine = 'Неверных ответов'
          correct = {games.sprint.correct}
          wrong= {games.sprint.wrong}
          numPercent = {games.sprint.correctPercent}
          textPercent = 'верных ответов'
        />
      </div>)}
      {user.userId && <div className='chartContainer'>
        <ChartStatistic learnedLong = {learnedLongData} newWords={newWordsData}/>
      </div>}

    </main>
    <Footer />
  </>
  );
}
