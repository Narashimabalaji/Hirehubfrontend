import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import AppLayout from './components/layout/AppLayout';
import JobFeed from './pages/JobFeed';
import ApplyJobPage from './components/ApplyJobPage';
import HirerJobPost from './components/HirerJobPost';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path='/home' element={<JobFeed />} />
          <Route path="/hirer/job-post" element={<HirerJobPost />} />

          <Route path='/apply/:jobId' element={<ApplyJobPage />} />
          {/* More protected routes can go here */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
