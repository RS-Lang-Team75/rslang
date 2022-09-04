import React from 'react';

import correctSound from '../../assets/sounds/correct.mp3';

import wrongSound from '@/assets/sounds/wrong.mp3';

export function HiddenSoundCorrect (): JSX.Element {

  const sound = new Audio(correctSound);
  sound.volume = 0.5;
  sound.play().catch(e => console.log(e));

  return(
    <div>
      <audio>
        <track src={correctSound} kind="captions"/>
      </audio>
    </div>
  );
}

export function HiddenSoundWrong (): JSX.Element {

  const sound = new Audio(wrongSound);
  sound.volume = 0.5;
  sound.play().catch(e => console.log(e));

  return(
    <div>
      <audio>
        <track src={correctSound} kind="captions"/>
      </audio>
    </div>
  );
}
