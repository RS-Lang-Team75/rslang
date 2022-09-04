import { Route, Routes } from 'react-router-dom';

import Audioсall from './components/Games/Audiocall/Audiocall';
import Sprint from './components/Games/Sprint/Sprint';
import { Navigation } from './components/Navigation/Navigation';
import { BookPage } from './pages/BookPage/BookPage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { MainPage } from './pages/MainPage/MainPage';
import { StatisticsPage } from './pages/StatisticsPage/StatisticPage';
import { TeamPage } from './pages/TeamPage/TeamPage';

export const App = (): JSX.Element =>  (
  <div className='wrapper'>
    <Navigation/>
    <Routes>
      <Route path='/' element={<MainPage/>} />
      <Route path='/book' element={<BookPage/>} />
      <Route path='/audiocall' element={<Audioсall/>} />
      <Route path='/sprint' element={<Sprint />} />
      <Route path='/statistic' element={<StatisticsPage/>} />
      <Route path='/team' element={<TeamPage/>} />
      <Route path='/login' element={<LoginPage/>} />
    </Routes>
  </div>

);
