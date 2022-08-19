import { Route, Routes } from 'react-router-dom';

import { Navigation } from './components/Navigation';
import { MainPage } from './pages/MainPage';

export const App = (): JSX.Element =>  (
  <>
    <Navigation/>
    <Routes>
      <Route path='/' element={<MainPage/>} />
    </Routes>
  </>

);
