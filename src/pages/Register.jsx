import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAxiosPublic from '../hooks/useAxiosPublic';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: '', successMessage: '' });
  const axiosPublic = useAxiosPublic();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', successMessage: '' });

    try {
      const res = await axiosPublic.post('/auth/register', formData);
      
      if (res.data.success) {
        // Show success message instead of redirecting
        setStatus({ loading: false, error: '', successMessage: res.data.message });
        setFormData({ name: '', email: '', password: '' }); // Clear form
      }
    } catch (err) {
      setStatus({ 
        loading: false, 
        error: err.response?.data?.message || 'Registration failed.', 
        successMessage: '' 
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 shadow-2xl p-8 sm:p-10 w-full max-w-md rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none"></div>

        {status.successMessage ? (
          <div className="text-center py-6 animate-fade-in-up">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Verify Your Email</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">{status.successMessage}</p>
            <Link to="/login" className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors border border-slate-700">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div className="text-center mb-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">Create Account</h2>
              <p className="text-slate-400 text-sm">Join the autonomous learning network.</p>
            </div>

            {status.error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm text-center">{status.error}</div>}
            
            <input 
              type="text" 
              name="name"
              placeholder="Full Name" 
              className="bg-slate-950/50 border border-slate-700 p-3.5 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input 
              type="email" 
              name="email"
              placeholder="Email Address" 
              className="bg-slate-950/50 border border-slate-700 p-3.5 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <input 
              type="password" 
              name="password"
              placeholder="Password (min 6 chars)" 
              className="bg-slate-950/50 border border-slate-700 p-3.5 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
            
            <button 
              type="submit" 
              disabled={status.loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 p-4 rounded-xl font-bold text-white transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)] active:scale-95 flex justify-center mt-2"
            >
              {status.loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Register'}
            </button>

            <p className="text-center text-slate-400 text-sm mt-2">
              Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">Login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;