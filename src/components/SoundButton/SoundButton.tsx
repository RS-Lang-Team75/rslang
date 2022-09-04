import { MutableRefObject, useEffect, useRef, useState } from 'react';

import AudioSvg from '@/assets/icons/audio.svg';
import StopSvg from '@/assets/icons/stop.svg';
import { IWord } from '@/types/types';

import './SoundButton.pcss';

interface SoundButtonProps{
  word:IWord;
  classBtn : string;
  playFirstOnly?: boolean;
  playOnMount?: boolean;
}

export function SoundButton (props: SoundButtonProps) {

  const { word, classBtn, playFirstOnly, playOnMount } = props;

  const SERVER_URL = 'https://rslang-team75.herokuapp.com';
  const firstSound = `${SERVER_URL}/${word.audio}`;
  const secondSound = `${SERVER_URL}/${word.audioMeaning}`;
  const thirdSound = `${SERVER_URL}/${word.audioExample}`;
  const allSoundsLinks:string[] = [firstSound,secondSound,thirdSound];

  const playNumRef = useRef(0);
  const playingRef = useRef(false);
  const vidRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying]=useState(true);

  // TODO:возможно получится переделать на useState, пока не работает корректно
  // const [currentlyPlayingSong, setCurrentlyPlayingSong] = useState(allSoundsLinks[0]);
  // const [playNum, setPlayNum] = useState(0);

  const playAudio = async () => {
    const audio = (vidRef as MutableRefObject<HTMLAudioElement>).current;
    audio.volume = 0.7;
    if(playingRef.current) {
      audio.src = allSoundsLinks[playNumRef.current];
      audio.load();
      await audio.play().catch(() => {
        throw new Error('problem playing audio');
      });
    }else{
      audio.pause();
      // playingRef.current=true;
      setPlaying(true);
    }

  };
  const playNext = () => {
    if(playNumRef.current < allSoundsLinks.length - 1 && !playFirstOnly){
      playingRef.current=true;
      playNumRef.current += 1;
      // TODO: для useState
      // setPlaying(true);
      // setPlayNum(p=>p+1);
    } else {
      playNumRef.current = 0;
      playingRef.current=false;
      // TODO: для useState
      // setPlayNum(p=>p*0);
      // setPlaying(false);
    }

    // setCurrentlyPlayingSong(allSoundsLinks[playNum]);

    playAudio().catch(() => {
      throw new Error('problem playing audio');
    });;
  };

  const activatePlayer = () => {
    setPlaying(false);
    playingRef.current = !playingRef.current;
    playAudio().catch(() => {
      throw new Error('problem playing audio');
    });;
  };

  useEffect(() => {
    if (playOnMount) {
      playingRef.current = true;
      setPlaying(false);
      playAudio().catch(() => {
        throw new Error('problem playing audio');
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word]);

  return (
    <div
      onClick={activatePlayer}
      onKeyPress={e => e.preventDefault()}
      role='button'
      tabIndex={0}
      aria-label='play'
      className='soundBtn'
    >
      <audio
        ref={vidRef}
        className={classBtn}
        onEnded={()=> playNext()}
      >
        <track src={word.word} kind="captions"/>
      </audio>
      {playing && <AudioSvg/>}
      {!playing && <StopSvg/>}
    </div>

  );
}
