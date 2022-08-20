import React from 'react';

import { CardMember } from '../CardMember/CardMember';

import './AboutTeam.pcss';

export function AboutTeam () : JSX.Element{
  return (
    <div className='wrapperAboutTeam'>
      <CardMember/>
      <CardMember/>
      <CardMember/>
    </div>
  );
}
