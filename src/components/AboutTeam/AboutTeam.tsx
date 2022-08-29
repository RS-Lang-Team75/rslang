import React from 'react';

import NadezhdaImg from '../../assets/images/Nadezhda.jpg';
import ExImg from '../../assets/images/example.png';
import { CardMember } from '../CardMember/CardMember';

import './AboutTeam.pcss';

export function AboutTeam () : JSX.Element{
  return (
    <>
      <h2 className='teamHeader'>Our team</h2>

      <div className='wrapperAboutTeam'>
        {/* card1 */}
        <CardMember imgLink = {ExImg}
          memberName = "Artem Selyugin"
          memberRole='Team leader, Frontend developer'
          gitHubLink= 'https://github.com/a-selyugin'
          telegramSvg = '#'/>
        {/* card2 */}
        <CardMember imgLink = {ExImg}
          memberName = "Maria Pashkovich"
          memberRole='Frontend developer'
          gitHubLink= 'https://github.com/pashkovichma'
          telegramSvg = '#'/>
        {/* TODO:add Link for Teleram */}
        {/* card3 */}
        <CardMember imgLink = {NadezhdaImg}
          memberName = "Nadezhda Budarina"
          memberRole='Frontend developer'
          gitHubLink= 'https://github.com/Hopechka'
          telegramSvg = 'https://t.me/Hopechka'/>
      </div>
    </>
  );
}
