import React, { useState } from 'react';

import EmailIcon from '../../assets/icons/email-icon.svg';
import LockIcon from '../../assets/icons/lock-icon.svg';
import UserIcon from '../../assets/icons/user-icon.svg';

import './LoginPage.pcss';
import { Button } from '@/components/Button/Button';

export function LoginPage (){

  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);

  return(
    <main className="login">

      <form className="form">
        <h2 className="form__header">Hello Again!</h2>
        <p className="form__sub-header">Welcome Back</p>

        {!isLoginMode &&
        <div className="form__normal">
          <UserIcon />
          <input id="user" className="form__input" type="text" name="user" placeholder="User Name" />
        </div>
        }

        <div className="form__normal">
          <EmailIcon />
          <input id="email" className="form__input" type="email" name="email" placeholder="Email Address" />
        </div>

        <div className={isLoginMode ? 'form__last' : 'form__normal'}>
          <LockIcon />
          <input className="form__input" type="password" name="password" id="password" placeholder="Password" />
        </div>

        {!isLoginMode &&
        <div className="form__last">
          <LockIcon />
          <input className="form__input" type="password" name="password" id="password" placeholder="Confirm password" />
        </div>
        }

        <Button
          text={isLoginMode ? 'Login' : 'Create user'}
          classBtn="form__login-btn"
          onClick={() => console.log('press check')}
        />
        <div className="form__sign-container">
          <Button
            text={isLoginMode ? 'Sign Up' : 'Login'}
            onClick={() => setIsLoginMode(m => !m)}
            classBtn='form__sign-up-btn'/>
        </div>
      </form>
    </main>
  );
}
