import { Link } from 'react-router-dom';

import React from 'react';

export function Navigation (){
  return(
    <nav
      className="container mx-auto max-w-2xl h-[60px] flex justify-between px-5 bg-sky-800 items-center text-white sticky top-0">

      <span>
        <Link to='/' className=" mr-2 text-3xl font-bold">RSLang</Link>
      </span>
      {/* <div className="flex sm:justify-center space-x-4">
        {[
          ['Учебник', '/book'],
          ['Словарь', '/description'],
          ['Игры', '/games'],
          ['Статистика', '/statistic'],
          ['Команда', '/command'],
          ['Видео', '/video'],
        ].map(([title, url]) => (
          <a href={url} className="rounded-lg px-3 py-2 text-slate-400 font-medium hover:bg-slate-100 hover:text-slate-700">{title}</a>
        ))}
      </div> */}
      <button  type="button" className='w-35 h-[40px] py-2 px-4 border rounded-lg bg-sky-400' >LOGIN</button>
    </nav>
  );
}
