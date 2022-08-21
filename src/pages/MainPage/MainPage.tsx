import React from 'react';

import { AboutTeam } from '@/components/AboutTeam/AboutTeam';
import { Carousel } from '@/components/Carousel/Carousel';

export function MainPage (){

  return(
    <main >
      <Carousel/>
      <AboutTeam/>
    </main>
  );
}
