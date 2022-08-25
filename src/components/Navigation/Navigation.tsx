/* eslint-disable jsx-a11y/interactive-supports-focus */
import { Link } from 'react-router-dom';

import React, { useState } from 'react';

import './Navigation.pcss';
import { Button } from '../Button/Button';

export function Navigation (): JSX.Element {
  const [isNavOpen, setIsNavOpen] = useState(false);
  return(
    <nav
      className="headerNav">
      <div className='wrapperNav'>
        <span>
          <Link to='/' className="navLogo">
            <span className = "rsLetters" >RS</span> Lang</Link>
        </span>
        <div className="desktopMenu">
          {[
            ['Учебник', '/book'],
            ['Словарь', '/dictionary'],
            ['Игры', '/games'],
            ['Статистика', '/statistic'],
            ['Команда', '/team'],
            ['Видео', '/video'],
          ].map(([title, url]) => (
            <Link key = {title} to={url} className="navLink">{title}</Link>
          ))}
        </div>

        <section className="mobileMenu">
          <div
            className="humbuggerIcon"
            onClick={() => setIsNavOpen((prev => !prev))}
            onKeyPress={() => setIsNavOpen((prev => !prev))}
            role='menu'
          >
            {!isNavOpen && <span className="line" />}
            {!isNavOpen && <span className="line" />}
            {!isNavOpen && <span className="line" />}

          </div>

          <div className={isNavOpen ? 'showMenuNav' : 'hideMenuNav'}>
            <div
              className="crossIcon"
              onClick={() => setIsNavOpen(false)}
              onKeyPress={() => setIsNavOpen(false)}
              role='menu'
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
            <div className="menuMobileOpen">
              {[
                ['LOGIN', '/login'],
                ['Учебник', '/book'],
                ['Словарь', '/dictionary'],
                ['Игры', '/games'],
                ['Статистика', '/statistic'],
                ['Команда', '/team'],
                ['Видео', '/video'],
              ].map(([title, url]) => (
                <Link key = {title} to={url} className="mobileMenuBtn" onClick={() => setIsNavOpen(false)} >{title}</Link>
              ))}
            </div>
          </div>
        </section>
        <Link key = "login-btn" to = "/login">
          <Button text = "LOGIN" classBtn="loginBtn"  />
        </Link>
      </div>
    </nav>
  );
}
