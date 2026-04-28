import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAxiosPublic from '../hooks/useAxiosPublic';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });
  const axiosPublic = useAxiosPublic();

  const handleForgot = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: '' });

    try {
      const res = await axiosPublic.post('/auth/forgotpassword', { email });
      if (res.data.success) {
        setStatus({ loading: false, message: 'Recovery email sent! Check your inbox.', error: '' });
      }
    } catch (error) {
      setStatus({ 
        loading: false, 
        message: '', 
        error: error.response?.data?.message || 'Failed to send recovery email.' 
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh] px-4">
      <form onSubmit={handleForgot} className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 shadow-2xl p-8 sm:p-10 rounded-3xl w-full max-w-md flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none"></div>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center tracking-tight">Account Recovery</h2>
        <p className="text-slate-400 text-sm text-center -mt-4">Enter your email and we'll send you a secure reset link.</p>
        
        {status.message && <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-xl text-sm text-center">{status.message}</div>}
        {status.error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm text-center">{status.error}</div>}

        <input 
          type="email" 
          placeholder="Email Address" 
          className="bg-slate-950/50 border border-slate-700 p-3.5 sm:p-4 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <button 
          type="submit" 
          disabled={status.loading || status.message}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 p-4 rounded-xl font-bold text-white transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)] active:scale-95 flex justify-center items-center"
        >
          {status.loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Send Reset Link'}
        </button>

        <p className="text-center text-sm text-slate-400 mt-2">
          Remembered your password? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;