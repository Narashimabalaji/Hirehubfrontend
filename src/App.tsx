import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import AppLayout from './components/layout/AppLayout';
import JobFeed from './pages/JobFeed';
import ApplyJobPage from './components/ApplyJobPage';
import HirerJobPost from './components/HirerJobPost';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard'; 


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path='/home' element={<JobFeed />} />
           <Route path='/register' element={<Register />} />
          <Route path="/hirer/job-post" element={<HirerJobPost />} />
          <Route path="/hirer/job-post" element={<HirerJobPost />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path='/apply/:jobId' element={<ApplyJobPage />} />
          {/* More protected routes can go here */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
