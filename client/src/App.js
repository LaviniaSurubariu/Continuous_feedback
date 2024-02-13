import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Homepage from './Homepage';
import Login from './Login';
import Navbar from './Navbar';

import Reactions from './Reactions';
import useCheckToken from './useCheckToken';
import { useSelector } from 'react-redux';
import Activity from './Activity';
import ActivityAnalytics from './ActivityAnalytics';
import NewAccount from './NewAccount';



function App() {
  const { loggedIn, checkTokenLoading, userRole } = useSelector((state) => state.global);

  useCheckToken()
  return (
    <Router>
      <Navbar />
      <Routes>
        {checkTokenLoading ?
          <Route path='*' element={<div>Spinner</div>} />
          :
          <>
            <Route path='/' element={<Homepage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/newAccount' element={<NewAccount />} />
            <Route path='/activities' element={<Activity />} />
            <Route path='/analytics' element={<ActivityAnalytics />} />
            <Route path='/reactions' element={<Reactions />} />

          </>}

      </Routes>
    </Router>
  );
}

export default App;