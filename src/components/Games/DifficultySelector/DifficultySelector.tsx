import React from 'react';

import { Button } from '@/components/Button/Button';

import './DifficultySelector.pcss';

interface IDiffSelector {
  returnRandomWords: (page: number, group: number) => Promise<void>;
}

export function DifficultySelector (props: IDiffSelector){

  const { returnRandomWords } = props;

  const chosePageAndGroup = async (groupNumber: number) => {
    const randomPage = Math.round(Math.random() * 30);
    await returnRandomWords(randomPage, groupNumber);
  };

  return(
    <section>
      <h4  className='selectorHeader'>Выбери уровень сложности:</h4>
      <div className="difficultySelector">
        <div className="selectorBtnWrap">
          <Button
            text='A1'
            classBtn='btn'
            onClick={() => {
              chosePageAndGroup(0).catch(err => console.log(err));
            }}/>
        </div>
        <div className="selectorBtnWrap">
          <Button
            text='A2'
            classBtn='btn'
            onClick={() => {
              chosePageAndGroup(1).catch(err => console.log(err));
            }}/>
        </div>
        <div className="selectorBtnWrap">
          <Button
            text='B1'
            classBtn='btn'
            onClick={() => {
              chosePageAndGroup(2).catch(err => console.log(err));
            }}/>
        </div>
        <div className="selectorBtnWrap">
          <Button
            text='B2'
            classBtn='btn'
            onClick={() => {
              chosePageAndGroup(3).catch(err => console.log(err));
            }}/>
        </div>
        <div className="selectorBtnWrap">
          <Button
            text='C1'
            classBtn='btn'
            onClick={() => {
              chosePageAndGroup(4).catch(err => console.log(err));
            }}/>
        </div>
        <div className="selectorBtnWrap">
          <Button
            text='C2'
            classBtn='btn'
            onClick={() => {
              chosePageAndGroup(5).catch(err => console.log(err));
            }}/>
        </div>
      </div>
    </section>
  );
}
