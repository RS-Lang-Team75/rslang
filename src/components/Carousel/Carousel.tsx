import { flushSync } from 'react-dom';

import { MutableRefObject, useRef, useState } from 'react';

import ArrowBack from '@/assets/icons/arrow-back.svg';
import ArrowForward from '@/assets/icons/arrow-forward.svg';
import Beach from '@/assets/images/beach.jpg';
import Clouds from '@/assets/images/clouds.jpg';
import Hand from '@/assets/images/hand.jpeg';
import Road from '@/assets/images/road.jpg';

import './Carousel.pcss';

interface ImgLink {
  [key: string]: {
    linkImg:string;
    text:string;
  };

}
export function Carousel (): JSX.Element  {
  const selectedRef = useRef<null | HTMLLIElement>(null);;
  const [index, setIndex] = useState(0);
  const imgLink:ImgLink={
    '0':{
      linkImg: Road,
      text:'Весь мир открыт для тебя...',
    },
    '1':{
      linkImg: Clouds,
      text:'Изучай английский вместе с нами...',
    },
    '2':{
      linkImg:'https://oir.mobi/uploads/posts/2021-06/1624559178_25-oir_mobi-p-pokorenie-vershini-gori-priroda-krasivo-fo-26.jpg',
      text:'Покоряй новые вершины...',
    },
    '3':{
      linkImg: Hand,
      text:'Мы поможем тебе на этом пути...',
    },
    '4':{
      linkImg: Beach,
      text:'Осуществи свою мечту!',
    },

  };
  const sliderList = [];
  for (let i = 0; i < 5; i+=1) {
    sliderList.push({
      id: i,
      imageUrl: imgLink[i].linkImg,
    });
  }
  function buttonNext (){
    flushSync(() => {
      if (index < sliderList.length - 1) {
        setIndex(index + 1);
      } else {
        setIndex(0);
      }
    });
    (selectedRef as MutableRefObject<HTMLLIElement>).current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }
  function buttonPrev (){
    flushSync(() => {
      if (index > 0) {
        setIndex(index - 1);
      } else {
        setIndex(sliderList.length - 1);
      }
    });
    (selectedRef as MutableRefObject<HTMLLIElement>).current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }

  return (
    <div className='carousel'>

      <div className='carouselContainer'>

        <ul className='slider'>
          {sliderList.map((slide, i) => (
            <li
              key={slide.id}
              ref={index === i ?
                selectedRef :
                null
              }
              className = 'slide'
            >
              <img
                className ='sliderImg'
                src={slide.imageUrl}
                alt={`slide #${ slide.id}`}
              />
              <p className='sign'> {imgLink[i].text}</p>
            </li>
          ))}
        </ul>
      </div>

      <div
        className ='sliderArrowRight'
        onClick={()=>buttonNext()}
        aria-hidden="true">
        <ArrowForward/>
      </div>

      <div
        className ='sliderArrowLeft'
        onClick={()=>buttonPrev()}
        aria-hidden="true">
        <ArrowBack/>
      </div>
    </div>
  );

}
