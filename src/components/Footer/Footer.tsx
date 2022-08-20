import React from 'react';

import GitPNG from '../../assets/images/GitHub-Mark-Light-64px.png';
import RSSvg from '../../assets/images/rs_school_js.svg';

import './Footer.pcss';

export function Footer () {
  return (
    <footer className="footer">
      <div className='wrapperFooter'>
        <div className="date"><span>2022</span></div>
        <div className="git-link">
          <a href="https://github.com/a-selyugin">
            <img src={GitPNG as string} alt="GitHub link" />

          </a>
          <a href="https://github.com/a-selyugin">
            <span>Artem</span>
          </a>
        </div>
        <div className="git-link">
          <a href="https://github.com/pashkovichma">
            <img src={GitPNG as string}  alt="GitHub link" />

          </a>
          <a href="https://github.com/pashkovichma">
            <span>Maria Pashkovich</span>
          </a>
        </div>
        <div className="git-link">
          <a href="https://github.com/Hopechka?tab=stars">
            <img src={GitPNG as string} alt="GitHub link" />

          </a>
          <a href="https://github.com/Hopechka?tab=stars">
            <span>Nadezhda</span>
          </a>
        </div>
        <div className="school-logo">
          <a href="https://rs.school/js/" aria-label = "RSschool-logo" ><RSSvg /></a>

        </div>
      </div>
    </footer>

  );
}
