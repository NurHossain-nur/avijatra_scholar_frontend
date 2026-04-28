import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Assuming you have this hook from the Navbar

const Landing = () => {
  // Check if the user is already logged in
  const { user } = useAuth();

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
      
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] lg:w-[800px] h-[300px] sm:h-[600px] bg-blue-600/15 sm:bg-blue-600/10 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* Hero Content Container */}
      <div className="max-w-4xl mx-auto z-10 flex flex-col items-center mt-[-5vh]">
        
        {/* Launch Badge */}
        <div className="animate-fade-in-up bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-6 sm:mb-8 shadow-[0_0_20px_rgba(59,130,246,0.15)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          The Future of EdTech is Here
        </div>

        {/* Fluid Hero Typography */}
        <h1 className="animate-fade-in-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white tracking-tight leading-[1.1] sm:leading-[1.15] lg:leading-[1.1] mb-6 sm:mb-8">
          The Autonomous <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
            Classroom Co-Pilot
          </span>
        </h1>
        
        <p className="animate-fade-in-up text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed sm:leading-relaxed px-2">
          Turn your device into an AI listening agent. Instantly generate perfectly formatted markdown notes, code blocks, and dynamic exam prep quizzes while you sit in class.
        </p>

        {/* Smart Call to Action (CTA) Buttons */}
        <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto px-4 sm:px-0">
          {user ? (
            // If logged in, send them straight to the Dashboard
            <Link 
              to="/dashboard" 
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 sm:py-4 rounded-2xl text-base sm:text-lg font-bold shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_40px_rgba(79,70,229,0.4)] transition-all hover:-translate-y-1 active:scale-[0.98] flex justify-center items-center gap-3"
            >
              Go to Your Dashboard
              <span className="text-xl leading-none">→</span>
            </Link>
          ) : (
            // If logged out, show the registration funnel
            <>
              <Link 
                to="/register" 
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 sm:py-4 rounded-2xl text-base sm:text-lg font-bold shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_40px_rgba(79,70,229,0.4)] transition-all hover:-translate-y-1 active:scale-[0.98] flex justify-center"
              >
                Start Your First Session
              </Link>
              <Link 
                to="/login" 
                className="w-full sm:w-auto bg-slate-900/50 hover:bg-slate-800 backdrop-blur-xl border border-slate-700/50 text-slate-200 px-8 py-4 sm:py-4 rounded-2xl text-base sm:text-lg font-semibold transition-all hover:-translate-y-1 active:scale-[0.98] flex justify-center"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Decorative Mockup / Trust UI (Optional Premium Touch) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[120%] sm:w-[80%] max-w-5xl h-64 sm:h-96 bg-slate-900/40 backdrop-blur-3xl border-t border-l border-r border-slate-700/50 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] flex items-start justify-center pt-8 opacity-50 -z-10 hidden sm:flex">
        <div className="w-20 h-2 bg-slate-700/50 rounded-full"></div>
      </div>
    </div>
  );
};

export default Landing;