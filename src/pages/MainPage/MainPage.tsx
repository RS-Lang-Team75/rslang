import Book from '@/assets/icons/book.svg';
import Difficult from '@/assets/icons/difficult.svg';
import Games from '@/assets/icons/games.svg';
import Statistic from '@/assets/icons/statistic.svg';
import { AboutTeam } from '@/components/AboutTeam/AboutTeam';
import { Carousel } from '@/components/Carousel/Carousel';

import './MainPage.pcss';

export function MainPage (){

  return(
    <main >
      <Carousel/>
      <section className='my-20'>
        <h2 className='teamHeader'>Оцени наши преимущества</h2>
        <div className='advantageCards'>
          <div className='advantageCard'>
            <Book className='advantageCardImg'/>
            <h3 className='advantageCardTitle'>Учебник</h3>
            <p className='advantageCardContent'>Вам доступны для обучения более 3500 часто употребляемых английских слов.
      Слова заботливо разбиты на разделы по уровню сложности, это позволит вам подходить к обучению системно и последовательно!</p>
          </div>
          <div className='advantageCard'>
            <Difficult className='advantageCardImg'/>
            <h3 className='advantageCardTitle'>Сложные слова</h3>
            <p className='advantageCardContent' >Мы знаем, как порой бывает сложно запомнить новые слова, и чтобы справиться с этим, наш учебник содержит раздел 7, куда вы сможете сохранять свою персональную подборку сложных слов,
              чтобы уделить им особое внимание при изучении.
            </p>
          </div>
          <div className='advantageCard'>
            <Games className='advantageCardImg'/>
            <h3 className='advantageCardTitle'>Игры</h3>
            <p className='advantageCardContent'>Порой, изучать слова может быть скучным! На этот случай мы предлагаем Вам на выбор две игры увлекательные игры,
               которые помогут вам натренировать запоминание слов, а так же восприятие слов на слух.
            </p>
          </div>
          <div className='advantageCard'>
            <Statistic className='advantageCardImg'/>
            <h3 className='advantageCardTitle'>Статистика</h3>
            <p className='advantageCardContent'>Изучение новых слов, это долгий процесс и очень важно видеть свой прогресс, чтобы не потерять мотивацию.
              Мы предлагаем Вам отслеживать свой прогресс в разделе статистики
            </p>
          </div>
        </div>
      </section>
      <AboutTeam/>
    </main>
  );
}
