import React from 'react';

import { GameButton } from '../GameButton/GameButton';

import './AudiocallAnswers.pcss';

interface AudiocallAnswers {
  answers: string[];
  isAnswerGiven: boolean;
  shownWordNumber: number;
  checkAnswer: (n: number) => string;
}

export default function AudioсallAnswers (props: AudiocallAnswers) {

  const {
    answers,
    isAnswerGiven,
    shownWordNumber,
    checkAnswer,
  } = props;

  return(
    <div className='answerBtnContainer'>
      {
        answers.map((w,i) =>
          <GameButton classBtn='answerBtn activeAnswerBtn'
            key={`${w.charCodeAt(0).toString(16)}${shownWordNumber}${i*1}`}
            id={`${i+1}`}
            onClick={e => {
              if (!isAnswerGiven) {
                e.currentTarget.classList.add(checkAnswer(Number(e.currentTarget.id)));
                e.currentTarget.classList.remove('activeAnswerBtn');
              }
            }}
            text={`${i+1}. ${w}`}
            simulatedButtonCode={`Digit${i+1}`}/>)
      }
    </div>
  );
}
