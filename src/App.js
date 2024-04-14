import './App.css';
import { Counter } from './features/counter/Counter';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import {app} from './firebase';
import VideoCall from './pages/VideoCall';
import 'prismjs/themes/prism.css';
import { ThemeProvider } from './ThemeContext';
import MyEditor from './pages/Quill';
import DocViewerComp from './component/DocViewer';

function App() {
  return (
    <>
    <ThemeProvider>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/videoCall" element={<VideoCall />} />
      <Route path="/quill" element={<MyEditor />} />
      <Route path="/doc" element={<DocViewerComp />} />
    </Routes>
    </ThemeProvider>
    </>
  );
}

export default App;
