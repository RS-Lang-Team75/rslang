import React from 'react';

import { AboutTeam } from '@/components/AboutTeam/AboutTeam';
import { Footer } from '@/components/Footer/Footer';

export function TeamPage (){
  return(
    <>
      <main className='mt-20'>
        <AboutTeam />
      </main>
      <Footer />
    </>
  );
}
