import React, { useEffect, useRef, useState } from 'react';

import './Countdown.pcss';

interface ICountdown {
  onTimerEnd: () => void;
}
export default function Countdown (props: ICountdown) {

  const { onTimerEnd } = props;

  const roundDuration = 30;

  const [timer, setTimer] = useState<number>(roundDuration);
  const [isRoundOver, setIsRoundOver] = useState<boolean>(false);

  useEffect( () => {
    if (isRoundOver) {
      onTimerEnd();
    }
  }, [isRoundOver, onTimerEnd]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getRemainingTime = (date: Date) => {
    const mSeconds = Date.parse(date.toString()) - Date.parse((new Date()).toString());
    return Math.floor(mSeconds / 1000);
  };

  const getDeadline = () => {
    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + roundDuration);
    return deadline;
  };

  useEffect(() => {
    const startTimer = (date: Date) => {
      const seconds = getRemainingTime(date);
      if (seconds > 0) {
        setTimer(seconds);
      } else {
        setIsRoundOver(true);
        if (timeoutRef.current){
          clearInterval(timeoutRef.current);
        }
      }
    };

    const clearTimer = (date: Date) => {
      setTimer(roundDuration);
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
      const id = setInterval(() => {
        startTimer(date);
      }, 1000);
      timeoutRef.current = id;
    };

    clearTimer(getDeadline());
  }, []);

  return(
    <section className='Timer'>
      <div>{timer}</div>
    </section>
  );
}
