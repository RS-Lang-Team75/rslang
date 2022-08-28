// import { Link } from 'react-router-dom';

import React, { useState, MouseEvent, KeyboardEvent } from 'react';
import 'flowbite';

import './SideBar.pcss';

import MenuSvg from '@/assets/icons/menu-bars.svg';

interface SideBarProps {
  onChange:(g:number)=>void;
}
// TODO refactor switch with object
export function SideBar ({ onChange }:SideBarProps) : JSX.Element{
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const savedGroup = Number(localStorage.getItem('currentGroup'));

  const sections = ['firstSection','secondSection', 'thirdSection', 'fourthSection',
    'fifthSection', 'sixthSection' , 'seventhSection'];
  const sectionsBgColor = { 'firstSection':'bg-gray-100',
    'secondSection':'bg-sky-100',
    'thirdSection':'bg-green-100',
    'fourthSection':'bg-yellow-100',
    'fifthSection':'bg-orange-100',
    'sixthSection':'bg-red-100' ,
    'seventhSection':'bg-purple-100' };

  const [firstSectionActive, setFirstSectionActive] = useState('' || (savedGroup === 0 && sectionsBgColor.firstSection));
  const [secondSectionActive, setSecondSectionActive] = useState('' || (savedGroup === 1 && sectionsBgColor.secondSection));
  const [thirdSectionActive, setThirdSectionActive] = useState('' || savedGroup === 2 && sectionsBgColor.thirdSection);
  const [fourthSectionActive, setFourthSectionActive] = useState('' || savedGroup === 3 && sectionsBgColor.fourthSection);
  const [fifthSectionActive, setFifthSectionActive] = useState('' || savedGroup === 4 && sectionsBgColor.fifthSection);
  const [sixthSectionActive, setSixthSectionActive] = useState('' || savedGroup === 5 && sectionsBgColor.sixthSection);
  const [seventhSectionActive, setSeventhSectionActive] = useState('' || savedGroup === 6 && sectionsBgColor.seventhSection);

  const firstSection = ['bookSection firstSection', firstSectionActive];
  const secondSection = ['bookSection secondSection', secondSectionActive];
  const thirdSection = ['bookSection thirdSection', thirdSectionActive];
  const fourthSection = ['bookSection fourthSection', fourthSectionActive];
  const fifthSection = ['bookSection fifthSection', fifthSectionActive];
  const sixthSection = ['bookSection sixthSection', sixthSectionActive];
  const seventhSection = ['bookSection seventhSection', seventhSectionActive];

  const sectionChoose = ({ currentTarget }: MouseEvent | KeyboardEvent)=>{
    setFirstSectionActive('');
    setSecondSectionActive('');
    setThirdSectionActive('');
    setFourthSectionActive('');
    setFifthSectionActive('');
    setSixthSectionActive('');
    setSeventhSectionActive('');
    const menuItemsClass = currentTarget.className.split(' ');
    const menuItemClass = menuItemsClass[1];
    const menuItemIndex = sections.findIndex(item=> item === menuItemClass);
    onChange(menuItemIndex);
    setIsSideBarOpen(false);
    switch (menuItemIndex) {
      case 0:
        setFirstSectionActive(sectionsBgColor.firstSection);
        break;
      case 1:
        setSecondSectionActive(sectionsBgColor.secondSection);
        break;
      case 2:
        setThirdSectionActive(sectionsBgColor.thirdSection);
        break;
      case 3:
        setFourthSectionActive(sectionsBgColor.fourthSection);
        break;
      case 4:
        setFifthSectionActive(sectionsBgColor.fifthSection);
        break;
      case 5:
        setSixthSectionActive(sectionsBgColor.sixthSection);
        break;
      default:
        setSeventhSectionActive(sectionsBgColor.seventhSection);
        break;
    }

  };

  return (
    <>

      <div
        className="menuIcon"
        onClick={() => setIsSideBarOpen((prev => !prev))}
        onKeyPress={() => setIsSideBarOpen((prev => !prev))}
        role='button'
        tabIndex={0}
      >
        <MenuSvg/>

      </div>
      <div className="sideBarContainer">
        <aside className={isSideBarOpen ? 'showMenuSideBar' : 'hideMenuSideBar'} aria-label="Sidebar" >
          <div className="menuSideBar">
            <ul className="space-y-2" role="menu">
              <li >
                <div className={firstSection .join(' ')}
                  onClick = {sectionChoose}
                  onKeyPress={sectionChoose}
                  role="menuitem"
                  tabIndex={0}>
                  <span className="ml-3">Раздел 1</span>
                </div>
              </li>
              <li>
                <div className={secondSection.join(' ')}
                  onClick = {sectionChoose}
                  onKeyPress={sectionChoose}
                  role="menuitem"
                  tabIndex={0}>
                  <span className="ml-3">Раздел 2</span>
                </div>
              </li>
              <li>
                <div className={thirdSection.join(' ')}
                  onClick = {sectionChoose}
                  onKeyPress={sectionChoose}
                  role="menuitem"
                  tabIndex={0}>
                  <span className="ml-3">Раздел 3</span>
                </div>
              </li>
              <li>
                <div className={fourthSection.join(' ')}
                  onClick = {sectionChoose}
                  onKeyPress={sectionChoose}
                  role="menuitem"
                  tabIndex={0}>
                  <span className="ml-3">Раздел 4</span>
                </div>
              </li>
              <li>
                <div className={fifthSection.join(' ')}
                  onClick = {sectionChoose}
                  onKeyPress={sectionChoose}
                  role="menuitem"
                  tabIndex={0}>
                  <span className="ml-3">Раздел 5</span>
                </div>
              </li>
              <li>
                <div className={sixthSection.join(' ')}
                  onClick = {sectionChoose}
                  onKeyPress={sectionChoose}
                  role="menuitem"
                  tabIndex={0}>
                  <span className="ml-3">Раздел 6</span>
                </div>
              </li>
              <li>
                <div
                  className={seventhSection.join(' ')}
                  onClick = {sectionChoose}
                  onKeyPress={sectionChoose}
                  role="menuitem"
                  tabIndex={0}>
                  <span className="ml-3">Раздел 7</span>
                </div>
              </li>
              {/* <li>
                <a href="#" className="bookSection seventhSection">
                  <span className="ml-3">Игра &quot;Аудиовызов&quot;</span>
                </a>
              </li>
              <li>
                <a href="#" className="bookSection seventhSection">
                  <span className="ml-3">Игра &quot;Спринт&quot;</span>
                </a>
              </li> */}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
