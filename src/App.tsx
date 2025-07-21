import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import AppLayout from './components/layout/AppLayout';
import JobFeed from './pages/JobFeed';
import ApplyJobPage from './components/ApplyJobPage';
import HirerJobPost from './components/HirerJobPost';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import HirerJobPosts from './pages/hirer/MyJobPosts'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route element={<ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
        }>
          <Route path='/' element={<JobFeed />} />
          <Route path="/job-post" element={<HirerJobPost />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path='/apply/:jobId' element={<ApplyJobPage />} />
          <Route path='/my-posts' element={<HirerJobPosts />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
