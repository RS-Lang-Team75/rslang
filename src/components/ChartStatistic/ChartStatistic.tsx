import 'chart.js/auto';
import { Line } from 'react-chartjs-2';

import React from 'react';

import './ChartStatistic.pcss';
import { StatisticsByDay, StatisticsStates } from '@/types/types';

interface ChartStatisticProps {
  statisticState:StatisticsStates;
}

export function ChartStatistic ({ statisticState  }:ChartStatisticProps) : JSX.Element{
  const learnedLong:StatisticsByDay[] =
   JSON.parse(statisticState.stateLearnedLong) as StatisticsByDay[];
  const newWords:StatisticsByDay[] =
   JSON.parse(statisticState.stateNewWords) as StatisticsByDay[];

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Прогресс',
        fontSize: 40,
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const userData = {
    labels: learnedLong.map(d => d.date),
    datasets: [
      {
        label: 'Всего выученных слов',
        data: learnedLong.map(d=>d.newWords || d.learnedWordsLong),
        backgroundColor: [
          '#fb7185',
        ],
        borderColor: '#9f1239',
        borderWidth: 2,
        yAxisID: 'y',
      },
      {
        label: 'Новых слов за день',
        data: newWords.map(d=>d.newWords || d.learnedWordsLong),
        backgroundColor: [
          '#38bdf8',
        ],
        borderColor: '#075985',
        borderWidth: 2,
        yAxisID: 'y1',
      },
    ],
  };

  return (
    <div className='w-full'>
      <Line options={options} data={userData}/>
    </div>
    // <div>Hello</div>
  );
}
