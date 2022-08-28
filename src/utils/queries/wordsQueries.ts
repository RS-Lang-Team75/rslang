import axios from 'axios';

import { IWord } from '@/types/types';

const axiosConfig = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};

export const randomWordsQuery = async (page: number, group: number): Promise<IWord[]> => {
  const response = await axios.get<IWord[]>(
    `https://rslang-team75.herokuapp.com/words?group=${group}&page=${page}`,
    axiosConfig);
  return response.data;
};
