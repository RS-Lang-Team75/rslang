import 'chart.js/auto';
import { Line } from 'react-chartjs-2';

import './ChartStatistic.pcss';
import { StatisticsByDay } from '@/types/types';

interface ChartStatisticProps {
  learnedLong:StatisticsByDay[];
  newWords:StatisticsByDay[];
}

export function ChartStatistic ({ learnedLong,newWords  }:ChartStatisticProps) : JSX.Element{

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    scales: {
      x:{
        display: false,
      },
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
    <div className='chartStatistic'>
      <Line options={options} data={userData}/>
    </div>
  );
}
