import { DoughnutStatistic } from '../Charts/DoughnutStatistic/DoughnutStatistic';
import './CardStatistics.pcss';

interface CardStatisticsProps {
  title:string;
  numUpLine?:number;
  numDownLine?:number;
  textUpLine:string;
  textDownLine:string;
  correct:number;
  wrong:number;
  numPercent:number;
  textPercent:string;
  numSeries?:number;
  textSeries?:string;
}

export function CardStatistics ({
  title,
  numUpLine,
  numDownLine,
  textUpLine,
  textDownLine,
  correct,
  wrong,
  numPercent,
  textPercent,
  numSeries,
  textSeries,
}:CardStatisticsProps) : JSX.Element{
  return (
    <div className='dayStatisticContainer'>
      <h2 className='dayStatisticTitle'>{title}</h2>
      <div className='dayStatisticWrapper'>
        <div className='dayStatisticBlock'>
          <p className='wordsNumber'>{numUpLine}</p>
          <p>{textUpLine}</p>
        </div>
        <div  className='dayStatisticBlock'>
          <p className='wordsNumber'>{numDownLine}</p>
          <p>{textDownLine}</p>
        </div>
        <div  className='dayStatisticBlock'>
          <p className='wordsNumber'>{numPercent} % </p>
          <p>{textPercent}</p>
        </div>
        <div  className='dayStatisticBlock'>
          <p className='wordsNumber'>{numSeries} </p>
          <p>{textSeries}</p>
        </div>
        <DoughnutStatistic className = "doughnutStatistic" correct={correct} wrong={wrong}/>
      </div>
    </div>
  );
}
