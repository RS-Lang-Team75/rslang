import { Route, Routes } from 'react-router-dom';

import { Navigation } from './components/Navigation/Navigation';
import { BookPage } from './pages/BookPage/BookPage';
import { DictionaryPage } from './pages/DictionaryPage/DictionaryPage';
import { GamesPage } from './pages/GamesPage/GamesPage';
import { MainPage } from './pages/MainPage/MainPage';
import { StatisticPage } from './pages/StatisticPage/StatisticPage';
import { TeamPage } from './pages/TeamPage/TeamPage';
import { VideoPage } from './pages/VideoPage/VideoPage';

export const App = (): JSX.Element =>  (
  <>
    <Navigation/>
    <Routes>
      <Route path='/' element={<MainPage/>} />
      <Route path='/book' element={<BookPage/>} />
      <Route path='/dictionary' element={<DictionaryPage/>} />
      <Route path='/games' element={<GamesPage/>} />
      <Route path='/statistic' element={<StatisticPage/>} />
      <Route path='/team' element={<TeamPage/>} />
      <Route path='/video' element={<VideoPage/>} />
    </Routes>
  </>

);
