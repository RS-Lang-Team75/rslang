import { useState, MouseEvent, KeyboardEvent } from 'react';
import 'flowbite';

import './SideBar.pcss';

import MenuSvg from '@/assets/icons/menu-bars.svg';

interface SideBarProps {
  onChange:(g:number)=>void;
}

export function SideBar ({ onChange }:SideBarProps) : JSX.Element{
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const savedGroup = Number(localStorage.getItem('currentGroup'));

  const sections = ['firstSection','secondSection', 'thirdSection', 'fourthSection',
    'fifthSection', 'sixthSection' , 'seventhSection'];

  const sectionsBgColor = ['bg-gray-100',
    'bg-sky-100',
    'bg-green-100',
    'bg-yellow-100',
    'bg-orange-100',
    'bg-red-100',
    'bg-purple-100'];

  const [sectionActive, setSectionActive] = useState<string[][]>([
    ['bookSection firstSection', (savedGroup === 0 ? sectionsBgColor[0]:'')],
    ['bookSection secondSection', (savedGroup === 1 ? sectionsBgColor[1]:'')],
    ['bookSection thirdSection', (savedGroup === 2 ? sectionsBgColor[2]:'')],
    ['bookSection fourthSection', (savedGroup === 3 ? sectionsBgColor[3]:'')],
    ['bookSection fifthSection', (savedGroup === 4 ? sectionsBgColor[4]:'')],
    ['bookSection sixthSection', (savedGroup === 5 ? sectionsBgColor[5]:'')],
    ['bookSection seventhSection', (savedGroup === 6 ? sectionsBgColor[6]:'')],
  ]);

  const sectionChoose = ({ currentTarget }: MouseEvent | KeyboardEvent)=>{

    const menuItemsClass = currentTarget.className.split(' ');
    const menuItemClass = menuItemsClass[1];
    const menuItemIndex = sections.findIndex(item=> item === menuItemClass);

    setSectionActive(
      sectionActive.map(item=> item.length > 1 ? item.slice(0,1) : item)
        .map((item, index) => {
          if (index === menuItemIndex){
            item.push(sectionsBgColor[index]);
            return item;
          }return item;
        }),
    );

    onChange(menuItemIndex);
    setIsSideBarOpen(false);

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
              {sectionActive.map((section,index)=>
                <li key = {sectionsBgColor[index]}>
                  <div
                    className={section.join(' ')}
                    onClick = {sectionChoose}
                    onKeyPress={sectionChoose}
                    role="menuitem"
                    tabIndex={0}>
                    <span className="ml-3">Раздел {index+1}</span>
                  </div>
                </li>,
              )}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
