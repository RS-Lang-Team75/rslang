import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';

import { useEffect, useState } from 'react';

import './DoughnutStatistic.pcss';

interface DoughnutStatisticProps {
  className:string;
  correct:number;
  wrong:number;
}

export function DoughnutStatistic ({
  className,
  correct,
  wrong,
}:DoughnutStatisticProps) : JSX.Element{

  const [statisticsData,setStatisticsData] = useState<number[]>([correct, wrong]);

  useEffect(()=>{
    setStatisticsData([correct,wrong]);
  },[correct, wrong]);

  const data = {
    labels: ['Верных', 'Неверных'],
    datasets: [
      {
        label: '% правильных ответов',
        data: statisticsData,
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',

        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',

        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className = {className}>
      <h3 className='text-center text-sky-900'>Процент верных ответов</h3>
      <Doughnut
        data={data}
      />
    </div>
  );
}
