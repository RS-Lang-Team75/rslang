import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import React, { FormEvent, useState } from 'react';

import EmailIcon from '../../assets/icons/email-icon.svg';
import LockIcon from '../../assets/icons/lock-icon.svg';
import UserIcon from '../../assets/icons/user-icon.svg';

import './LoginPage.pcss';

import { Button } from '@/components/Button/Button';
import { UserCredentials } from '@/types/userTypes';
import { createUser, signIn } from '@/utils/queries/userQueries';
import { saveAll } from '@/utils/slices/userSlice';
import { RootState } from '@/utils/store/store';

export function LoginPage (){

  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [details, setDetails] = useState<UserCredentials>({
    name: '',
    email: '',
    password: '',
  });
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);
  const passwordMinLength = 8;
  const [isNameValid, setIsNameValid] = useState<boolean>(true);
  const [isLoginFailed, setIsLoginFailed] = useState<boolean>(false);

  const clearForm = ():void => {
    setDetails({
      name: '',
      email: '',
      password: '',
    });
  };

  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const validateName = (): void => {
    if (details.name.length > 0) {
      setIsNameValid(true);
    } else {
      setIsNameValid(false);
    }
  };

  const validateEmail = (): void => {
    const emailRegExp = /\S+@\S+\.\S+/;
    if (emailRegExp.test(details.email)) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }
  };

  const validatePassword = (): void => {
    if (details.password.length >= passwordMinLength) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }
  };

  const submitHandler = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (isEmailValid && isPasswordValid) {
      if (isLoginMode) {
        try {
          const response = await signIn(details);
          dispatch(saveAll({
            name: response.name,
            token: response.token,
            userId: response.userId,
            refreshToken: response.refreshToken,
          }));
        } catch {
          setIsLoginFailed(true);
        }
      } else if (isNameValid) {
        try {
          await createUser(details);
          clearForm();
          setIsLoginMode(true);
        } catch {
          setIsLoginFailed(true);
        }
      }
    }
  };

  return(
    <main className="login">
      <form className="form">
        {isLoginMode ?
          <>
            <h2 className="form__header">Привет{user.name && `, ${user.name}`}! </h2>
            <p className="form__sub-header">Рады, что ты с нами!</p>
          </> :
          <>
            <h2 className="form__header">Давай знакомиться! </h2>
            <p className="form__sub-header" />
          </>
        }
        {!user.name &&
        <div>
          {!isLoginMode &&
          <>
            <div className={`form__input-container ${(!isNameValid || isLoginFailed) ? 'form__input-container_invalid' : ''}`}>
              <UserIcon />
              <input
                id="name"
                onChange={e => setDetails({ ...details, name: e.target.value })}
                onBlur={validateName}
                onFocus={() => {
                  setIsNameValid(true);
                  setIsLoginFailed(false);
                }}
                value={details.name}
                className="form__input"
                type="text"
                name="name"
                placeholder="Имя"
              />
            </div>
            <div className='form__error'>
              {!isNameValid && <p className='form__error-message'>Имя не должно быть пустым</p>}
            </div>
          </>
          }
          <div className={`form__input-container ${(!isEmailValid || isLoginFailed) ? 'form__input-container_invalid' : ''}`}>
            <EmailIcon />
            <input id="email"
              value={details.email}
              onChange={e => {
                setDetails({ ...details, email: e.target.value });
              }}
              onFocus={() => {
                setIsEmailValid(true);
                setIsLoginFailed(false);
              }}
              onBlur={validateEmail}
              className="form__input"
              type="email"
              name="email"
              placeholder="Email"
            />
          </div>
          <div className='form__error'>
            {!isEmailValid && <p className='form__error-message'>Пожалуйста, введи корректный e-mail</p>}
          </div>
          <div className={`form__input-container ${(!isPasswordValid || isLoginFailed)? 'form__input-container_invalid' : ''}`}>
            <LockIcon />
            <input className="form__input"
              value={details.password}
              onChange={e => setDetails({ ...details, password: e.target.value })}
              onFocus={() => {
                setIsPasswordValid(true);
                setIsLoginFailed(false);
              }}
              onBlur={validatePassword}
              type="password"
              name="password"
              id="password"
              placeholder="Пароль"
            />
          </div>
          <div className='form__error'>
            {!isPasswordValid && <p className='form__error-message'>Пароль должен быть не короче 8 символов</p>}
            {isLoginFailed && <p className='form__error-message'>Что-то пошло не так, проверь введенные данные</p>}
          </div>
          <Button
            text={isLoginMode ? 'Войти' : 'Создать аккаунт'}
            classBtn="form__login-btn"
            onClick={e => {
              submitHandler(e)
                .catch(() => {
                  throw new Error('cannot login');
                });
            }}
          />
          <div className="form__sign-container">
            <Button
              text={isLoginMode ? 'Создать аккаунт?' : 'Уже есть аккаунт?'}
              onClick={() => {
                setIsLoginMode(m => !m);
                clearForm();
              }}
              classBtn='form__sign-up-btn'/>
          </div>
        </div>}

        {user.name &&
        <Link
          key='linkToBook'
          to='/book'
          className='form__login-btn'
        >Начать учиться!
        </Link>}
      </form>
    </main>
  );
}
