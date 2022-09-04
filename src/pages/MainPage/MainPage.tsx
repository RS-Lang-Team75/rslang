import React from 'react';

import { AboutTeam } from '@/components/AboutTeam/AboutTeam';
import { Carousel } from '@/components/Carousel/Carousel';
import { Footer } from '@/components/Footer/Footer';

export function MainPage (){

  return(
    <>
      <main>
        <Carousel />
        <AboutTeam />
      </main>
      <Footer />
    </>
  );
}
