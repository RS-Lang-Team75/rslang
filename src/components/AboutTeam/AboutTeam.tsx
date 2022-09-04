import React from 'react';

import Artem from '@/assets/images/Artem.jpg';
import NadezhdaImg from '@/assets/images/Nadezhda.jpg';
import { CardMember } from '@/components/CardMember/CardMember';

import './AboutTeam.pcss';

export function AboutTeam () : JSX.Element{
  return (
    <>
      <h2 className='teamHeader'>Наша команда</h2>

      <div className='wrapperAboutTeam'>
        {/* card1 */}
        <CardMember
          imgLink = {Artem}
          memberName = "Artem Selyugin"
          memberRole='Team leader, Frontend developer'
          gitHubLink= 'https://github.com/a-selyugin'
          telegramSvg = '#'
          cardText='Авторизация, игры "Аудиовызов", "Спринт". Запросы и сбор статистики по играм.'
        />
        {/* card2 */}
        <CardMember
          imgLink = {NadezhdaImg}
          memberName = "Nadezhda Budarina"
          memberRole='Frontend developer'
          gitHubLink= 'https://github.com/Hopechka'
          telegramSvg = 'https://t.me/Hopechka'
          cardText='Главная страница, роутинг, учебник, "сложные слова", статистика, страница "Команда". Запросы и сбор статистики по учебнику.'
        />
      </div>
    </>
  );
}
