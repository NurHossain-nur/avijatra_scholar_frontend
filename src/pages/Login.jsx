import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAxiosPublic from '../hooks/useAxiosPublic';
import useAuth from '../hooks/useAuth'; // 1. Import useAuth

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 2. Properly initialize your hooks
  const axiosPublic = useAxiosPublic(); 
  const { loginUser } = useAuth(); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 3. Use the axios instance (axiosPublic), not the hook function
      const res = await axiosPublic.post('/auth/login', { email, password });
      
      if (res.data.success) {
        // 4. Use your global login function to handle localStorage + State sync
        loginUser(res.data.user, res.data.token);
        
        // 5. Redirect
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <form onSubmit={handleLogin} className="glass-panel p-8 w-full max-w-md flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-center mb-4">Welcome Back</h2>
        
        <input 
          type="email" 
          placeholder="Email Address" 
          className="bg-slate-800/50 border border-slate-600 p-3 rounded-lg text-white focus:outline-none focus:border-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          className="bg-slate-800/50 border border-slate-600 p-3 rounded-lg text-white focus:outline-none focus:border-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 p-3 rounded-lg font-bold transition mt-2 flex justify-center items-center"
        >
          {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Login'}
        </button>

        <p className="text-center text-slate-400 mt-2">
          Don't have an account? <Link to="/register" className="text-blue-400 hover:text-blue-300">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;