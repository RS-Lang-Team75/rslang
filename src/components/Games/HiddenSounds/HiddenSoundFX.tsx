import React, { useEffect } from 'react';

import correctSound from '@/assets/sounds/correct.mp3';
import wrongSound from '@/assets/sounds/wrong.mp3';

interface IHiddenSoundFx {
  isAnswerCorrect: boolean;
  isSoundOn: boolean;
}

export function HiddenSoundFX (props: IHiddenSoundFx): JSX.Element {

  const { isAnswerCorrect, isSoundOn } = props;

  useEffect(() => {
    const sound = new Audio(isAnswerCorrect ? correctSound : wrongSound);
    sound.volume = 0.5;

    if (isSoundOn) {
      sound.play().catch(() => {
        throw new Error('problem playing audio');
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnswerCorrect]);

  return(
    <div>
      <audio>
        <track src={isAnswerCorrect ? correctSound : wrongSound} kind="captions"/>
      </audio>
    </div>
  );
}
