import { Route, Routes } from 'react-router-dom';

import { Navigation } from './components/Navigation/Navigation';
import { BookPage } from './pages/BookPage';
import { MainPage } from './pages/MainPage';

export const App = (): JSX.Element =>  (
  <>
    <Navigation/>
    <Routes>
      <Route path='/' element={<MainPage/>} />
      <Route path='/book' element={<BookPage/>} />
    </Routes>
  </>

);
