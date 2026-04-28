import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LiveRoom from './pages/LiveRoom';
import PrivateRoute from './routes/PrivateRoute';
import QuizView from './pages/QuizView';
import NoteDetailView from './pages/NoteDetailView';

function App() {
  return (
    <Router>
      <div className="dark-bg font-sans">
        <Navbar />
        <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes - Wrapped in PrivateRoute */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            <Route path="/live" element={
              <PrivateRoute>
                <LiveRoom />
              </PrivateRoute>
            } />

            <Route path="/quiz/:id" element={
              <PrivateRoute>
                <QuizView />
              </PrivateRoute>
            } />

            <Route path="/note/:id" element={
              <PrivateRoute>
                <NoteDetailView />
              </PrivateRoute>
            } />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;