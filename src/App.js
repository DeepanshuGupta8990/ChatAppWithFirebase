import './App.css';
import { Counter } from './features/counter/Counter';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import {app} from './firebase';
import VideoCall from './pages/VideoCall';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/videoCall" element={<VideoCall />} />
    </Routes>
    </>
  );
}

export default App;
