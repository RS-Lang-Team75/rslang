import React, { useRef } from 'react';

import { ButtonProps } from '@/components/Button/Button';
import { useKey } from '@/utils/ customHooks/useKey';

import './GameButton.pcss';

interface GameButtonProps extends ButtonProps{
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
