import React, {  useRef } from 'react';

import PageFirstPNG from '../../assets/svg/page-first.png';
import PageLastSvg from '../../assets/svg/page-last.svg';
import { Button } from '../Button/Button';

import './Pagination.pcss';

interface PaginationProps {
  handlePages:(page:number)=>void;
  page:number;
}

export function Pagination ({ handlePages, page }:PaginationProps) : JSX.Element {

  const pagePagRef = useRef(page);
  const TOTAL_PAGES = 29;
  const hasPrev =  page > 0;
  const hasNext = pagePagRef.current < TOTAL_PAGES || page===0;
  // console.log('pagePagRef.current: ', pagePagRef.current);
  // console.log('page: ', page);

  function handleClickPlus () {
    if (hasNext) {
      pagePagRef.current = page+1;
    }
    handlePages(pagePagRef.current);

  }

  function handleClickMinus () {
    if (hasPrev) {
      pagePagRef.current = page-1;
    }
    handlePages(pagePagRef.current);

  }

  function handleClickFirst (){
    pagePagRef.current = 0;
    handlePages(pagePagRef.current);
  }

  function handleClickLast (){
    pagePagRef.current = TOTAL_PAGES;
    handlePages(pagePagRef.current);
  }

  return (
    <div className='pagination'>
      <Button
        classBtn='firstBtn'
        text = ""
        disabled={!hasPrev}
        onClick={()=>handleClickFirst()}>
        <img className='w-5 h-5' src={PageFirstPNG}  alt="arrow first" />
      </Button>
      <Button
        classBtn='prevBtn'
        text = ""
        disabled={!hasPrev}
        onClick={()=>handleClickMinus()}>
        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
      </Button>
      <div className='currentPage'>{page+1}</div>

      <Button
        classBtn='nextBtn'
        text = ""
        disabled={!hasNext}
        onClick={()=>handleClickPlus()}>
        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
      </Button>
      <Button
        classBtn='lastBtn'
        text = ""
        disabled={!hasNext}
        onClick={()=>handleClickLast()}>
        <i className='w-5 h-5 '><PageLastSvg/></i>
      </Button>
    </div>

  );
}
