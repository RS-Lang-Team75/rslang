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
    <section className='difficultySelectorContainer'>
      <h4  className='selectorHeader'>Выбери уровень сложности:</h4>
      <div className="difficultySelector">
        <Button
          text='A1'
          classBtn={chosenGroup === 1 ? 'selectorBtnWrap chosenDiff' : 'selectorBtnWrap'}
          onClick={() => {
            chosePageAndGroup(0)
              .catch(throwErrorMessage);
          }}/>

        <Button
          text='A2'
          classBtn={chosenGroup === 2 ? 'selectorBtnWrap chosenDiff' : 'selectorBtnWrap'}
          onClick={() => {
            chosePageAndGroup(1)
              .catch(throwErrorMessage);
          }}/>

        <Button
          text='B1'
          classBtn={chosenGroup === 3 ? 'selectorBtnWrap chosenDiff' : 'selectorBtnWrap'}
          onClick={() => {
            chosePageAndGroup(2)
              .catch(throwErrorMessage);
          }}/>

        <Button
          text='B2'
          classBtn={chosenGroup === 4 ? 'selectorBtnWrap chosenDiff' : 'selectorBtnWrap'}
          onClick={() => {
            chosePageAndGroup(3)
              .catch(throwErrorMessage);
          }}/>

        <Button
          text='C1'
          classBtn={chosenGroup === 5 ? 'selectorBtnWrap chosenDiff' : 'selectorBtnWrap'}
          onClick={() => {
            chosePageAndGroup(4)
              .catch(throwErrorMessage);
          }}/>

        <Button
          text='C2'
          classBtn={chosenGroup === 6 ? 'selectorBtnWrap chosenDiff' : 'selectorBtnWrap'}
          onClick={() => {
            chosePageAndGroup(5)
              .catch(throwErrorMessage);
          }}/>

      </div>
    </section>
  );
}
