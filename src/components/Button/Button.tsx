import React from 'react';

import './Button.pcss';

interface ButtonProps{
  text: string;
  classBtn : string;
}

export const Button = ({ text,classBtn }:ButtonProps): JSX.Element => (
  <button  type="button" className={classBtn} >{text}</button>
);
