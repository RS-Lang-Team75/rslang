import React from 'react';

import { AboutTeam } from '@/components/AboutTeam/AboutTeam';

export function MainPage (){

  return(
    <main className='flex-auto' >
      <h1 className="text-3xl font-bold underline">
      RSLang
      </h1>
      <AboutTeam/>

    </main>
  );
}
