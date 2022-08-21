import { flushSync } from 'react-dom';

import React, { MutableRefObject, useRef, useState } from 'react';

import './Carousel.pcss';
import ArrowLeft from '../../assets/images/left-arrow.png';
import ArrowRight from '../../assets/images/right-arrow.png';
// import { Button } from '../Button/Button';

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
      linkImg:'https://img1.goodfon.ru/wallpaper/nbig/0/f7/ssha-nevada-doroga-pustynya.jpg',
      text:'Весь мир открыт для тебя...',
    },
    '1':{
      linkImg:'https://kartinkin.net/uploads/posts/2021-07/thumbs/1625164206_50-kartinkin-com-p-fon-nebo-s-oblakami-krasivie-foni-51.jpg',
      text:'Изучай английский вместе с нами...',
    },
    '2':{
      linkImg:'https://oir.mobi/uploads/posts/2021-06/1624559178_25-oir_mobi-p-pokorenie-vershini-gori-priroda-krasivo-fo-26.jpg',
      text:'Покоряй новые вершины...',
    },
    '3':{
      linkImg:'https://www.genivity.com/wp-content/uploads/2018/07/roman-kraft-266787-unsplash-1080x675.jpg',
      text:'Мы поможем тебе на этом пути...',
    },
    '4':{
      linkImg:'https://img2.goodfon.ru/wallpaper/nbig/b/61/summer-beach-sea-shore-6733.jpg',
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
    <div className='flex justify-center items-center mb-10 mt-4'>

      <div className='w-full overflow-hidden'>

        <ul className='whitespace-nowrap inline-block shadow-lg'>
          {sliderList.map((slide, i) => (
            <li
              key={slide.id}
              ref={index === i ?
                selectedRef :
                null
              }
              className = 'w-full whitespace-nowrap inline-block relative'
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
      {/* <Button
        text=''
        onClick={()=>buttonPrev()}
        classBtn='btnPrev'/> */}
      <div
        className ='sliderArrowRight'
        onClick={()=>buttonNext()}
        aria-hidden="true">
        <img
          className ='sliderArrow'
          src={ArrowRight}
          alt='arrow right'
        />
      </div>

      {/* <Button
        text=''
        onClick={()=>buttonNext()}
        classBtn='btnNext'/>
    */}
      <div
        className ='sliderArrowLeft'
        onClick={()=>buttonPrev()}
        aria-hidden="true">
        <img
          className ='sliderArrow'
          src={ArrowLeft}
          alt='arrow right'
        />
      </div>
    </div>
  );

}

// return (
//   <div className='w-full'>
//     <Button
//       text='Prev'
//       onClick={()=>buttonPrev()}
//       classBtn='carousel-control-prev absolute top-0 bottom-0 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline left-0'/>

//     <Button
//       text='Next'
//       onClick={()=>buttonNext()}
//       classBtn='carousel-control-next absolute top-0 bottom-0 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline right-0'/>

//     <div className="p-12 flex justify-center w-full md:w-1/2 items-center">

//       <div className='relative w-full'>
//         <div className='carousel'>
//           {sliderList.map((slide, i) => (
//             <div
//               key={slide.id}
//               ref={index === i ?
//                 selectedRef :
//                 null
//               }
//               className= 'w-full flex-shrink-0'

//             >
//               <img
//                 className='w-full object-contain'
//                 src={slide.imageUrl}
//                 alt={`slide #${  slide.id}`}
//               />
//               <div className="carousel-caption hidden md:block absolute text-center z-40 bottom-1/4">
//                 <h5 className="text-xl">First slide label</h5>
//                 <p>Some representative placeholder content for the first slide.</p>
//               </div>
//             </div>

//           ))}
//         </div>
//       </div>
//     </div>
//   </div>

// );
