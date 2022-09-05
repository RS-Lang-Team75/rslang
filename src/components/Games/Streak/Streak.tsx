import React from 'react';

import './Streak.pcss';

interface ISoundFXControl {
  currentStreak: number;
}

export function Streak (props: ISoundFXControl){

  const { currentStreak } = props;

  return(
    <div className="currentStreak">
      {Array(currentStreak).fill('❇').map(i =>
        <div
          key={Math.random()*10000}
          className='streakStars'
        >{i}
        </div>)}
    </div>
  );
}
