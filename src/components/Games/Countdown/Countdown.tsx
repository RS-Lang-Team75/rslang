import React, { useEffect, useState } from 'react';

import './Countdown.pcss';

interface ICountdown {
  onTimerEnd: () => void;
}
export default function Countdown (props: ICountdown) {

  const { onTimerEnd } = props;

  const roundDuration = 30;

  const [timer, setTimer] = useState<number>(roundDuration);
  const [isRoundOver, setIsRoundOver] = useState<boolean>(false);

  const tick = () => {
    if (timer === 0) {
      setIsRoundOver(true);
    } else {
      setTimer(t => t - 1);
    }
  };

  useEffect(() => {
    const timerId = setInterval(() => tick(), 1000);
    return () => clearInterval(timerId);
  });

  useEffect( () => {
    if (isRoundOver) {
      onTimerEnd();
    }
  }, [isRoundOver, onTimerEnd]);

  return(
    <section className='Timer'>
      <div>{timer}</div>
    </section>
  );
}
