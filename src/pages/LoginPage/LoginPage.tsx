import React from 'react';
import './LoginPage.pcss';

export function LoginPage (){

  return(
    <main className="login">

      <form className="form">
        <h2 className="form__header">Hello Again!</h2>
        <p className="form__sub-header">Welcome Back</p>
        <div className="form__email">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
          <input id="email" className="form__input" type="email" name="email" placeholder="Email Address" />
        </div>
        <div className="form__password">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <input className="form__input" type="password" name="password" id="password" placeholder="Password" />
        </div>
        <button type="button" className="form__login-btn">Login</button>
        <div className="form__sign-container">
          <a href="/login" className="form__sign-up-btn">Sign up</a>
        </div>
      </form>
    </main>
  );
}
