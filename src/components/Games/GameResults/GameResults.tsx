import React from 'react';

import './GameResults.pcss';
import { GameResultLine } from '../GameResultLine/GameResultLine';

import { IWord } from '@/types/types';

interface IGameResults {
  correctAnswers: IWord[];
  wrongAnswers: IWord[];
}

export function GameResults (props: IGameResults){

  const { correctAnswers, wrongAnswers } = props;

  return(
    <section>
      <h4  className='selectorHeader'>Твои результаты:</h4>
      <section className="gameResultsSection">
        <div className="wrongAnswers">
          <div className="headerContainer">
            <h4 className='header'>Ошибок</h4>
            <div className="indicator wrong">
              {wrongAnswers.length}
            </div>
          </div>
          {wrongAnswers.map(w =>
            <GameResultLine
              key={w.id}
              word={w}/>)}
        </div>
        <div className="correctAnswers">
          <div className="headerContainer">
            <h4 className='header'>Знаю</h4>
            <div className="indicator correct">
              {correctAnswers.length}
            </div>
          </div>
          {correctAnswers.map(w =>
            <GameResultLine
              key={w.id}
              word={w}/>)}
        </div>
      </section>
    </section>
  );
}
