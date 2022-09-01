import React from 'react';

import { Button } from '@/components/Button/Button';

import './DifficultySelector.pcss';

interface IDiffSelector {
  returnRandomWords: (page: number, group: number) => Promise<void>;
  chosenGroup: number;
}

export function DifficultySelector (props: IDiffSelector){

  const {
    returnRandomWords,
    chosenGroup,
  } = props;

  const chosePageAndGroup = async (groupNumber: number) => {
    const randomPage = Math.round(Math.random() * 30);
    await returnRandomWords(randomPage, groupNumber);
  };

  const throwErrorMessage = () => {
    throw new Error('Cannot get words');
  };

  return(
    <section>
      <h4  className='selectorHeader'>Выбери уровень сложности:</h4>
      <div className="difficultySelector">
        <div
          className={chosenGroup === 1 ? 'selectorBtnWrap chosenDiff' : 'selectorBtnWrap'}>
          <Button
            text='A1'
            classBtn='btn'
            onClick={() => {
              chosePageAndGroup(0)
                .catch(throwErrorMessage);
            }}/>
        </div>
        <div
          className={chosenGroup === 2 ? 'selectorBtnWrap chosenDiff' : 'selectorBtnWrap'}>
          <Button
            text='A2'
            classBtn='btn'
            onClick={() => {
              chosePageAndGroup(1)
                .catch(throwErrorMessage);
            }}/>
        </div>
        <div
          className={chosenGroup === 3 ? 'selectorBtnWrap chosenDiff' : 'selectorBtnWrap'}>
          <Button
            text='B1'
            classBtn='btn'
            onClick={() => {
              chosePageAndGroup(2)
                .catch(throwErrorMessage);
            }}/>
        </div>
        <div
          className={chosenGroup === 4 ? 'selectorBtnWrap chosenDiff' : 'selectorBtnWrap'}>
          <Button
            text='B2'
            classBtn='btn'
            onClick={() => {
              chosePageAndGroup(3)
                .catch(throwErrorMessage);
            }}/>
        </div>
        <div
          className={chosenGroup === 5 ? 'selectorBtnWrap chosenDiff' : 'selectorBtnWrap'}>
          <Button
            text='C1'
            classBtn='btn'
            onClick={() => {
              chosePageAndGroup(4)
                .catch(throwErrorMessage);
            }}/>
        </div>
        <div
          className={chosenGroup === 6 ? 'selectorBtnWrap chosenDiff' : 'selectorBtnWrap'}>
          <Button
            text='C2'
            classBtn='btn'
            onClick={() => {
              chosePageAndGroup(5)
                .catch(throwErrorMessage);
            }}/>
        </div>
      </div>
    </section>
  );
}
