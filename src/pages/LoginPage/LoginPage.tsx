import { useSelector, useDispatch } from 'react-redux';

import React, { FormEvent, useState } from 'react';

import EmailIcon from '../../assets/icons/email-icon.svg';
import LockIcon from '../../assets/icons/lock-icon.svg';
import UserIcon from '../../assets/icons/user-icon.svg';

import './LoginPage.pcss';

import { Button } from '@/components/Button/Button';
import { UserCredentials } from '@/types/userTypes';
import { createUser, signIn } from '@/utils/queries/userQueries';
import { saveName, saveToken, saveUserId } from '@/utils/slices/userSlice';
import { RootState } from '@/utils/store/store';

export function LoginPage (){

  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [details, setDetails] = useState<UserCredentials>({
    name: '',
    email: '',
    password: '',
  });

  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const submitHandler = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (isLoginMode) {
      const response = await signIn(details);
      dispatch(saveName(response.name));
      dispatch(saveToken(response.token));
      dispatch(saveUserId(response.userId));
    } else {
      console.log(await createUser(details));
    }
  };

  return(
    <main className="login">

      <form className="form">
        <h2 className="form__header">Hello Again{user.name && `, ${user.name}`}! </h2>
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
          onClick={e => {
            // eslint-disable-next-line no-void
            void submitHandler(e);
          }
          }
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
