/* eslint-disable @typescript-eslint/no-floating-promises */
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useSelector } from 'react-redux';

import { UserStatistics } from '@/types/types';
import { statisticsForStudiedWords } from '@/utils/queries/statisticQueries';
import { RootState } from '@/utils/store/store';

export function StatisticsPage (){
  const user = useSelector((state: RootState) => state.user);
  const SERVER_URL = 'https://rslang-team75.herokuapp.com';

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
      console.log('statistics data', response.data);
      await statisticsForStudiedWords(user);

    } catch (e:unknown) {
      const error = e as AxiosError;
      console.log(error);
    }

  };
  return(
    <main>
      <button
        type = 'button'
        onClick={getStatistics}
        className='w-30 h-10 bg-orange-400 border-red-400'>get statistics</button>
    </main>

  );
}
