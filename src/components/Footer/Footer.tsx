import React from 'react';

import GitPNG from '../../assets/images/GitHub-Mark-Light-64px.png';
import RSSvg from '../../assets/svg/rs_school_js.svg';

import './Footer.pcss';

export function Footer (): JSX.Element {
  return (
    <footer className="footer">
      <div className='wrapperFooter'>
        <div className="date"><span>2022</span></div>
        <div className="git-link">
          <a href="https://github.com/a-selyugin"
            rel="noreferrer noopener"
            target="_blank">
            <img src={GitPNG} alt="GitHub link" />

          </a>
          <a href="https://github.com/a-selyugin"
            rel="noreferrer noopener"
            target="_blank">
            <span>Artem</span>
          </a>
        </div>
        <div className="git-link">
          <a href="https://github.com/pashkovichma"
            rel="noreferrer noopener"
            target="_blank">
            <img src={GitPNG}  alt="GitHub link" />

          </a>
          <a href="https://github.com/pashkovichma"
            rel="noreferrer noopener"
            target="_blank">
            <span>Maria Pashkovich</span>
          </a>
        </div>
        <div className="git-link">
          <a href="https://github.com/Hopechka?tab=stars"
            rel="noreferrer noopener"
            target="_blank">
            <img src={GitPNG} alt="GitHub link" />

          </a>
          <a href="https://github.com/Hopechka?tab=stars"
            rel="noreferrer noopener"
            target="_blank">
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
