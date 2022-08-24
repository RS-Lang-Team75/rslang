import './Button.pcss';
// import { useState } from 'react';

import AudioSvg from '@/assets/icons/audio.svg';

interface SoundButtonProps{
  soundUrl: string;
  classBtn : string;

}

export function SoundButton ({ soundUrl,classBtn }:SoundButtonProps) {
  const audio = new Audio(soundUrl);
  audio.volume = 0.7;
  // const [playing, setPlaying]=useState(false); //TODO: возможно понадобится в других задачах

  function playAudio (){
    audio.play(); // TODO: должна уйти ошибка, когда появится отдельная папка для Fetch
    // if (playing) {
    //   audio.pause();
    // } else {
    //   audio.play();
    // }
    // setPlaying(!playing);
  };

  return (
    <button
      type='button'
      className={classBtn}
      onClick={playAudio}>
      <AudioSvg/>
    </button>
  );
}
