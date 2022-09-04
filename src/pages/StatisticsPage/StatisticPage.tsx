import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useSelector } from 'react-redux';

import { useEffect, useState } from 'react';

import { ChartStatistic } from '@/components/Charts/ChartStatistic/ChartStatistic';
import { DoughnutStatistic } from '@/components/Charts/DoughnutStatistic/DoughnutStatistic';
import { Footer } from '@/components/Footer/Footer';
import { StatisticsByDay, UserStatistics } from '@/types/types';
import { SERVER_URL } from '@/utils/queries/url';
import { RootState } from '@/utils/store/store';
import './StatisticsPage.pcss';

export function StatisticsPage (){

  const [learnedLongData, setLearnedLongData] = useState<StatisticsByDay[]>([]);
  const [learnedByDayData, setLearnedByDayData] = useState<StatisticsByDay[]>([]);
  const [newWordsData, setNewWordsData] = useState<StatisticsByDay[]>([]);

  const user = useSelector((state: RootState) => state.user);

  useEffect(()=>{
    const wordsAxiosConfig: AxiosRequestConfig = {
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };

    const getStatistics = async () => {
      try {

        const response = await axios.get<UserStatistics>(
          `${SERVER_URL}/users/${user.userId}/statistics`,
          wordsAxiosConfig);

        const learnedLongParse:StatisticsByDay[] =
        JSON.parse(response.data.optional.stateLearnedLong) as StatisticsByDay[];
        setLearnedLongData(learnedLongParse);

        const learnedByDayParse:StatisticsByDay[] =
        JSON.parse(response.data.optional.stateLearnedByDay) as StatisticsByDay[];
        setLearnedByDayData(learnedByDayParse);

        const newWordsDataParse:StatisticsByDay[] =
        JSON.parse(response.data.optional.stateNewWords) as StatisticsByDay[];
        setNewWordsData(newWordsDataParse);

      } catch (e:unknown) {
        const err = e as AxiosError;
        throw new Error(`GET statisticsPage query error, ${err.message}`);
      }

    };

    getStatistics().catch(() => {
      throw new Error('Cannot get statistics');
    });
  },[user]);

  return(
    <>
      <main>

        {!user.userId && <h1 className='message'>Статистика доступна только для авторизированных пользователей</h1>}
        {user.userId && <div className='dayStatisticContainer'>
          <div className='dayStatisticBlock'>
            <p className='wordsNumber'>{newWordsData.length !== 0 ? newWordsData.slice(-1)[0].newWords : 0}</p>
            <p>Новых слов за сегодня</p>
          </div>
          <div className='dayStatisticBlock'>
            <p className='wordsNumber'>{learnedByDayData.length !== 0 ? learnedByDayData.slice(-1)[0].learnedWordsByDay : 0}</p>
            <p>Изученных слов за сегодня</p>
          </div>
          <DoughnutStatistic />
        </div>}
        {user.userId && <div className='chartContainer'>
          <ChartStatistic learnedLong={learnedLongData} newWords={newWordsData} />
        </div>}

      </main>
      <Footer />
    </>
  );
}
