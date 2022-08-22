import React, { MouseEventHandler } from 'react';

import './Button.pcss';

interface ButtonProps{
  text: string;
  classBtn : string;
  disabled?:boolean;
  children?:React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const Button = ({
  text,
  classBtn,
  disabled,
  children,
  onClick,
}:ButtonProps): JSX.Element => (
  <button type="button" className={classBtn} disabled= {disabled} onClick={onClick}>
    {text}
    {children}
  </button>
);
