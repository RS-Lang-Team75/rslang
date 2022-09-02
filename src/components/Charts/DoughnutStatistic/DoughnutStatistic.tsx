import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';

import './DoughnutStatistic.pcss';

// interface DoughnutStatisticProps {
//   // learnedLong:StatisticsByDay[];
//   // newWords:StatisticsByDay[];
// }

export function DoughnutStatistic () : JSX.Element{
  const data = {
    labels: ['Верных', 'Неверных'],
    datasets: [
      {
        label: '% правильных ответов',
        data: [80, 20],
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
    <div className='row-span-2 w-[200px]'>
      <h3 className='text-center text-sky-900'>Процент верных ответов</h3>
      <Doughnut
        data={data}
      />
    </div>
  );
}
