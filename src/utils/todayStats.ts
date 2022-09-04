import { UserState } from './slices/userSlice';

import { GameName } from '@/types/types';

const getDate = ():string=>{
  const date = new Date();
  return`${date.getFullYear()} ${date.toDateString().substring(4, 7)} ${date.getDate()}`;
};

type GameLocalStats = {
  correct: number;
  wrong: number;
  correctPercent: number;
  bestStreak: number;
  newWords: number;
};

export type LocalDailyStatistics = {
  date: string;
  allCorrect: number;
  allWrong: number;
  allPercent: number;
  games: {
    audiocall: GameLocalStats;
    sprint: GameLocalStats;
  };
};

export const InitialDailyStatistics = {
  date: '',
  allCorrect: 0,
  allWrong: 0,
  allPercent: 0,
  games: {
    audiocall: {
      correct: 0,
      wrong: 0,
      correctPercent: 0,
      bestStreak: 0,
      newWords: 0,
    },
    sprint: {
      correct: 0,
      wrong: 0,
      correctPercent: 0,
      bestStreak: 0,
      newWords: 0,
    },
  },
};

const readAndCheckLocalStats = (user: UserState): LocalDailyStatistics => {
  const today = getDate();

  const savedData = localStorage.getItem(`${user.userId}stats`);
  let statistics;
  if (savedData) {
    statistics = JSON.parse(savedData) as LocalDailyStatistics;
  } else {
    statistics = structuredClone(InitialDailyStatistics);
  }

  if (statistics.date !== today) {
    statistics = structuredClone(InitialDailyStatistics);
  }

  statistics.date = today;

  return statistics;
};

export const recordGameStats = (
  user: UserState,
  gameName: GameName,
  correct: number,
  wrong: number,
  bestStreak: number,
  newWords: number,
) => {
  const statistics = readAndCheckLocalStats(user);

  statistics.allCorrect += correct;
  statistics.allWrong += wrong;
  statistics.games[gameName].correct += correct;
  statistics.games[gameName].wrong += wrong;
  statistics.games[gameName].newWords += newWords;

  const game = statistics.games[gameName];

  if (bestStreak > game.bestStreak) {
    statistics.games[gameName].bestStreak = bestStreak;
  }

  const allPercent = Math.floor(
    statistics.allCorrect / (statistics.allCorrect + statistics.allWrong) * 100 );

  const gamePercent = Math.floor(game.correct / (game.correct + game.wrong) * 100 );

  statistics.allPercent = allPercent;
  statistics.games[gameName].correctPercent = gamePercent;

  localStorage.setItem(`${user.userId}stats`, JSON.stringify(statistics));
};
