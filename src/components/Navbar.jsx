import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="mx-4 md:mx-8 mt-4 sticky top-4 z-50">
      {/* Main Glass Panel */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-5 py-3 md:px-8 md:py-4 rounded-2xl flex justify-between items-center transition-all duration-300">
        
        {/* Responsive Brand Logo */}
        <Link 
          to="/" 
          onClick={closeMenu}
          className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-widest bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent hover:scale-105 transition-transform origin-left"
        >
          AVIJATRA<span className="text-white">.SCHOLAR</span>
        </Link>

        {/* DESKTOP MENU (Hidden on Mobile) */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm lg:text-base font-medium text-slate-300 hover:text-white transition-colors duration-300">
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm lg:text-base px-5 py-2.5 rounded-xl font-semibold border border-slate-700/50 hover:border-slate-500 transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm lg:text-base font-medium text-slate-300 hover:text-white transition-colors duration-300">
                Login
              </Link>
              <Link to="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm lg:text-base px-6 py-2.5 rounded-xl font-semibold shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all duration-300">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU TOGGLE BUTTON (Hidden on Desktop) */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-slate-300 hover:text-white focus:outline-none p-2"
        >
          {isMobileMenuOpen ? (
            // Close Icon (X)
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger Icon
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <div className={`md:hidden absolute top-full left-0 w-full mt-2 transition-all duration-300 origin-top ${isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-700/50 shadow-2xl rounded-2xl p-5 flex flex-col space-y-4">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                onClick={closeMenu}
                className="text-base sm:text-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 px-4 py-3 rounded-xl transition"
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full text-left text-base sm:text-lg text-red-400 font-medium hover:text-red-300 hover:bg-red-500/10 px-4 py-3 rounded-xl transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                onClick={closeMenu}
                className="text-base sm:text-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 px-4 py-3 rounded-xl transition"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                onClick={closeMenu}
                className="w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base sm:text-lg font-semibold px-4 py-3 rounded-xl shadow-lg transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;