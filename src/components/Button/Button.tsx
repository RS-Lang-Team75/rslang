import React, { MouseEventHandler, ReactNode } from 'react';

import './Button.pcss';

export interface ButtonProps{
  text: string;
  classBtn : string;
  disabled?:boolean;
  children?:ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  id?: string;
}

export const Button = ({
  text,
  classBtn,
  disabled,
  children,
  onClick,
  id,
}:ButtonProps): JSX.Element => (
  <button
    type="button"
    className={classBtn}
    disabled={disabled}
    onClick={onClick}
    id={id}>
    {text}
    {children}
  </button>
);
