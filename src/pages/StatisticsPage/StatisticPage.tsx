/* eslint-disable @typescript-eslint/no-floating-promises */
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useSelector } from 'react-redux';

import { useEffect, useState } from 'react';

import { ChartStatistic } from '@/components/ChartStatistic/ChartStatistic';
import { UserStatistics } from '@/types/types';
import { statisticsForStudiedWords } from '@/utils/queries/statisticQueries';
import { RootState } from '@/utils/store/store';

export function StatisticsPage (){
  const userStatistics:UserStatistics = {
    learnedWords:0,
    optional:{
      stateLearnedByDay:'[]',
      stateNewWords:'[]',
      stateLearnedLong:'[]',
    },
  };
  const [statisticState, setStatisticState] = useState<UserStatistics>(userStatistics);
  const user = useSelector((state: RootState) => state.user);
  const SERVER_URL = 'https://rslang-team75.herokuapp.com';

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
        await statisticsForStudiedWords(user);

        const response = await axios.get<UserStatistics>(
          `${SERVER_URL}/users/${user.userId}/statistics`,
          wordsAxiosConfig);

        // console.log('statistics data', response.data);
        setStatisticState(response.data);

      } catch (e:unknown) {
        const err = e as AxiosError;
        throw new Error(`GET statisticsPage query error, ${err.message}`);
      }

    };
    getStatistics();
  },[user]);

  return(
    <main>
      {!user.userId && <h1 className='message'>Статистика доступна только для авторизированных пользователей</h1>}
      {user.userId && <div className='flex w-5/6 justify-center items-center mx-auto'>
        <ChartStatistic statisticState = {statisticState.optional}/>
      </div>}

    </main>

  );
}
