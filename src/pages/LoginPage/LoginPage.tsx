import React, { FormEvent, useState } from 'react';

import EmailIcon from '../../assets/icons/email-icon.svg';
import LockIcon from '../../assets/icons/lock-icon.svg';
import UserIcon from '../../assets/icons/user-icon.svg';

import './LoginPage.pcss';
import { Button } from '@/components/Button/Button';
import { UserCredentials } from '@/types/userTypes';

export function LoginPage (){

  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [details, setDetails] = useState<UserCredentials>({
    name: '',
    email: '',
    password: '',
  });

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    console.log(details);
  };

  return(
    <main className="login">

      <form className="form">
        <h2 className="form__header">Hello Again!</h2>
        <p className="form__sub-header">Welcome Back</p>

        {!isLoginMode &&
        <div className="form__normal">
          <UserIcon />
          <input
            id="name"
            onChange={e => setDetails({ ...details, name: e.target.value })}
            value={details.name}
            className="form__input"
            type="text"
            name="name"
            placeholder="User Name"
          />
        </div>
        }

        <div className="form__normal">
          <EmailIcon />
          <input id="email"
            value={details.email}
            onChange={e => setDetails({ ...details, email: e.target.value })}
            className="form__input"
            type="email"
            name="email"
            placeholder="Email Address"
          />
        </div>

        <div className={isLoginMode ? 'form__last' : 'form__normal'}>
          <LockIcon />
          <input className="form__input"
            value={details.password}
            onChange={e => setDetails({ ...details, password: e.target.value })}
            type="password"
            name="password"
            id="password"
            placeholder="Password"
          />
        </div>

        {!isLoginMode &&
        <div className="form__last">
          <LockIcon />
          <input className="form__input"
            type="password"
            name="password"
            id="password-confirm"
            placeholder="Confirm password"
          />
        </div>
        }

        <Button
          text={isLoginMode ? 'Login' : 'Create user'}
          classBtn="form__login-btn"
          onClick={submitHandler}
        />
        <div className="form__sign-container">
          <Button
            text={isLoginMode ? 'Sign Up?' : 'Already have an account?'}
            onClick={() => setIsLoginMode(m => !m)}
            classBtn='form__sign-up-btn'/>
        </div>
      </form>
    </main>
  );
}
