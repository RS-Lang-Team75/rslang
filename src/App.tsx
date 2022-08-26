import { Route, Routes } from 'react-router-dom';

import { Footer } from './components/Footer/Footer';
import { Navigation } from './components/Navigation/Navigation';
import { BookPage } from './pages/BookPage/BookPage';
import { DifficultPage } from './pages/DifficultPage/DifficultPage';
import { GamesPage } from './pages/GamesPage/GamesPage';
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
      <Route path='/difficult' element={<DifficultPage/>} />
      <Route path='/games' element={<GamesPage/>} />
      <Route path='/statistic' element={<StatisticPage/>} />
      <Route path='/team' element={<TeamPage/>} />
      <Route path='/login' element={<LoginPage/>} />
    </Routes>
    <Footer/>
  </div>

);
