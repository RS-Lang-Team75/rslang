import React, { MouseEventHandler, useRef } from 'react';

import { useKey } from '@/utils/ customHooks/useKey';

import './GameButton.pcss';

interface GameButtonProps{
  text: string;
  classBtn : string;
  disabled?:boolean;
  children?:React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  id?: string;
  simulatedButtonCode: string;
}

export function GameButton ({
  text,
  classBtn,
  disabled,
  children,
  onClick,
  id,
  simulatedButtonCode,
}:GameButtonProps): JSX.Element {

  const inputRef = useRef<HTMLButtonElement>(null);

  useKey(simulatedButtonCode, () => {
    if (inputRef.current) inputRef.current.click();
  });

  return (
    <button
      ref={inputRef}
      type="button"
      className={classBtn}
      disabled={disabled}
      onClick={onClick}
      id={id}>
      {text}
      {children}
    </button>
  );
}
