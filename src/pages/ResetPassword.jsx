import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosPublic from '../hooks/useAxiosPublic';
import useAuth from '../hooks/useAuth';

const ResetPassword = () => {
  const { token } = useParams(); // Grabs the token from the URL
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const axiosPublic = useAxiosPublic();
  
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '' });

  const handleReset = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '' });

    try {
      // Notice this is a PUT request!
      const res = await axiosPublic.put(`/auth/resetpassword/${token}`, { password });
      
      if (res.data.success) {
        // Automatically log them in with the new token provided by the backend
        loginUser(res.data.user, res.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      setStatus({ 
        loading: false, 
        error: error.response?.data?.message || 'Invalid or expired token.' 
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh] px-4">
      <form onSubmit={handleReset} className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 shadow-2xl p-8 sm:p-10 rounded-3xl w-full max-w-md flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none"></div>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center tracking-tight">Set New Password</h2>
        <p className="text-slate-400 text-sm text-center -mt-4">Your identity is verified. Choose a strong password.</p>
        
        {status.error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm text-center">{status.error}</div>}

        <input 
          type="password" 
          placeholder="New Password (min 6 chars)" 
          className="bg-slate-950/50 border border-slate-700 p-3.5 sm:p-4 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength="6"
          required
        />
        
        <button 
          type="submit" 
          disabled={status.loading}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 p-4 rounded-xl font-bold text-white transition-all shadow-[0_10px_20px_rgba(16,185,129,0.2)] active:scale-95 flex justify-center items-center"
        >
          {status.loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Update & Login'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;