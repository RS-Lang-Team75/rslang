import React from 'react';

import './Button.pcss';

interface ButtonProps{
  text: string;
  classBtn : string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button = ({ text, classBtn, onClick }:ButtonProps): JSX.Element => (
  <button type="button" className={classBtn} onClick={onClick}>{text}</button>
);
