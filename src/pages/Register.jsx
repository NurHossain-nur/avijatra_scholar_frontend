import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAxiosPublic from '../hooks/useAxiosPublic';
import useAuth from '../hooks/useAuth';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const axiosPublic = useAxiosPublic();
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Clean, professional API call using your custom instance
      const res = await axiosPublic.post('/auth/register', formData);
      
      if (res.data.success) {
        // Update global AuthContext and LocalStorage instantly
        loginUser(res.data.user, res.data.token);
        // Redirect to the dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <form onSubmit={handleRegister} className="glass-panel p-8 w-full max-w-md flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-slate-400 text-center text-sm mb-4">Join the autonomous learning network.</p>

        {/* Error Message Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}
        
        <input 
          type="text" 
          name="name"
          placeholder="Full Name" 
          className="bg-slate-800/50 border border-slate-600 p-3 rounded-lg text-white focus:outline-none focus:border-blue-400 transition"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input 
          type="email" 
          name="email"
          placeholder="Email Address" 
          className="bg-slate-800/50 border border-slate-600 p-3 rounded-lg text-white focus:outline-none focus:border-blue-400 transition"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <input 
          type="password" 
          name="password"
          placeholder="Password" 
          className="bg-slate-800/50 border border-slate-600 p-3 rounded-lg text-white focus:outline-none focus:border-blue-400 transition"
          value={formData.password}
          onChange={handleChange}
          required
          minLength="6"
        />
        
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed p-3 rounded-lg font-bold transition mt-2 flex justify-center items-center"
        >
          {loading ? (
             <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            'Register'
          )}
        </button>

        <p className="text-center text-slate-400 mt-2">
          Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;