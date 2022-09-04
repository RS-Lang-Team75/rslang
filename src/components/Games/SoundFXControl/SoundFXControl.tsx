import React from 'react';

import './SoundFXControl.pcss';

import SoundOff from '@/assets/icons/music_off.svg';
import SoundOn from '@/assets/icons/music_on.svg';

interface ISoundFXControl {
  isSoundOn: boolean;
  soundControlCallback: () => void;
}

export function SoundFXControl (props: ISoundFXControl){

  const { isSoundOn, soundControlCallback } = props;

  return(
    <div
      className='soundControlBtn'
      onClick={soundControlCallback}
      onKeyUp={e => e.preventDefault()}
      role='button'
      tabIndex={0}
    >
      {
        !isSoundOn && <SoundOff />
      }
      {
        isSoundOn && <SoundOn />
      }
    </div>
  );
}
