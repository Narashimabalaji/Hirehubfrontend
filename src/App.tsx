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
import { AuthProvider } from './store/auth';


const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route element={<ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
          }>
            <Route path='/home' element={<JobFeed />} />
            <Route path="/hirer/job-post" element={<HirerJobPost />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path='/apply/:jobId' element={<ApplyJobPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
