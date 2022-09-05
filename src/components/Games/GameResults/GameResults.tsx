/* eslint-disable no-underscore-dangle */
import React from 'react';

import './GameResults.pcss';
import { GameResultLine } from '../GameResultLine/GameResultLine';

import { IWord } from '@/types/types';

interface IGameResults {
  correctAnswers: IWord[];
  wrongAnswers: IWord[];
  bestStreak?:number;
}

export function GameResults (props: IGameResults){

  const { correctAnswers, wrongAnswers, bestStreak } = props;

  let congratulations = 'Неплохо! Но повторить слова не помешает 😉';
  let bestStreakCongrats = '';

  const correct = correctAnswers.length;
  const wrong = wrongAnswers.length;

  if (bestStreak) {
    bestStreakCongrats = `Лучшая серия правильных ответов: ${bestStreak} ❇`;
  }

  if (wrong >= correct) {
    congratulations = 'Ты можешь лучше! Повтори слова и попробуй еще раз 😅';
  }
  if (correct / wrong > 0.8) {
    congratulations = 'Отлично, так держать! 😇';
  }
  return(
    <section
      className='gameResults'
    >
      <h2 className='congratulations'>
        {congratulations}
      </h2>
      <h2 className='resultsHeader'>
        {bestStreakCongrats}
      </h2>
      <h4  className='resultsHeader'>Твои результаты:</h4>
      <section className="gameResultsSection">
        <div className="wrongAnswers">
          <div className="headerContainer">
            <h4 className='header'>Ошибок</h4>
            <div className="indicator wrong">
              {wrongAnswers.length}
            </div>
          </div>
          {wrongAnswers.map((w,i) =>
            <GameResultLine
              key={`${(w.id || w._id)}${Math.floor(i*Math.random() * 100)}`}
              word={w}/>)}
        </div>
        <div className="correctAnswers">
          <div className="headerContainer">
            <h4 className='header'>Знаю</h4>
            <div className="indicator correct">
              {correctAnswers.length}
            </div>
          </div>
          {correctAnswers.map((w,i) =>
            <GameResultLine
              key={`${(w.id || w._id)}${Math.floor(i*Math.random() * 100)}`}
              word={w}/>)}
        </div>
      </section>
    </section>
  );
}
