import { Link } from 'react-router-dom';

import React, { useState } from 'react';
import './navigation.css';

export function Navigation (){
  const [isNavOpen, setIsNavOpen] = useState(false);
  return(
    <nav
      className="container mx-auto w-screen h-[60px] flex justify-between px-5 bg-sky-800 items-center text-white sticky top-0">

      <span>
        <Link to='/' className=" mr-2 text-3xl font-bold">
          <span className="text-sky-200" >RS</span> Lang</Link>
      </span>
      <div className=" DESKTOP-MENU hidden space-x-8 flex sm:justify-center space-x-4">
        {[
          ['Учебник', '/book'],
          ['Словарь', '/description'],
          ['Игры', '/games'],
          ['Статистика', '/statistic'],
          ['Команда', '/command'],
          ['Видео', '/video'],
        ].map(([title, url]) => (
          <Link key = {title} to={url} className="rounded-lg px-3 py-2 text-sky-200 font-medium hover:bg-sky-200 hover:text-sky-800">{title}</Link>
        ))}
      </div>

      <section className="MOBILE-MENU flex lg:hidden">
        <div
          className="HAMBURGER-ICON space-y-2"
          onClick={() => setIsNavOpen(prev => !prev)}
        >
          {!isNavOpen && <span className="block h-0.5 w-8 animate-pulse bg-sky-200" />}
          {!isNavOpen && <span className="block h-0.5 w-8 animate-pulse bg-sky-200" />}
          {!isNavOpen && <span className="block h-0.5 w-8 animate-pulse bg-sky-200" />}

        </div>

        <div className={isNavOpen ? 'showMenuNav' : 'hideMenuNav'}>
          <div
            className="CROSS-ICON absolute top-0 right-0 px-8 py-8 bg-sky-800 "
            onClick={() => setIsNavOpen(false)}
          >
            <svg
              className="h-8 w-8 text-sky-200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <div className="MENU-LINK-MOBILE-OPEN flex flex-col items-center justify-between min-h-[250px] bg-sky-800">
            <button  type="button" className=' w-32 border-b my-2 uppercase rounded-lg px-3 py-2 text-sky-200 font-medium bg-sky-400 hover:bg-sky-200 hover:text-sky-800' >LOGIN</button>
            {[
              ['Учебник', '/book'],
              ['Словарь', '/description'],
              ['Игры', '/games'],
              ['Статистика', '/statistic'],
              ['Команда', '/command'],
              ['Видео', '/video'],
            ].map(([title, url]) => (
              <Link key = {title} to={url} className="w-32 border-b my-2 uppercase rounded-lg px-3 py-2 text-sky-200 font-medium hover:bg-sky-200 hover:text-sky-800 text-center">{title}</Link>
            ))}
          </div>
        </div>
      </section>

      <button  type="button" className='w-35 h-[40px] py-2 px-4 border rounded-lg bg-sky-400 hover:bg-sky-200 hover:text-sky-800' >LOGIN</button>
    </nav>
  );
}
