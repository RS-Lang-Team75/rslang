import { Route, Routes } from 'react-router-dom';

import { Footer } from './components/Footer/Footer';
import Audioсall from './components/Games/Audiocall/Audiocall';
import { Navigation } from './components/Navigation/Navigation';
import { BookPage } from './pages/BookPage/BookPage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { MainPage } from './pages/MainPage/MainPage';
import { StatisticPage } from './pages/StatisticPage/StatisticPage';
import { TeamPage } from './pages/TeamPage/TeamPage';

export const App = (): JSX.Element =>  (
  <div className='wrapper'>
    <Navigation/>
    <Routes>
      <Route path='/' element={<MainPage/>} />
      <Route path='/book' element={<BookPage/>} />
      <Route path='/audiocall' element={<Audioсall/>} />
      <Route path='/statistic' element={<StatisticPage/>} />
      <Route path='/team' element={<TeamPage/>} />
      <Route path='/login' element={<LoginPage/>} />
    </Routes>
    <Footer/>
  </div>

);
