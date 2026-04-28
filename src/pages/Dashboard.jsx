import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../hooks/useAxiosSecure';

const Dashboard = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const user = JSON.parse(localStorage.getItem('user'));

  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [filterDept, setFilterDept] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axiosSecure.get('/lectures/my-notes');
        if (response.data.success) {
          setNotes(response.data.notes);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, [axiosSecure]);

  // Derived state: Apply filters
  const filteredNotes = notes.filter(note => {
    const matchesDept = filterDept ? note.department === filterDept : true;
    const matchesLevel = filterLevel ? note.level === filterLevel : true;
    const matchesSem = filterSemester ? note.semester === filterSemester : true;
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesLevel && matchesSem && matchesSearch;
  });

  return (
    <div className="min-h-[85vh] text-slate-200 px-4 sm:px-6 lg:px-8 py-6 lg:py-10 relative overflow-hidden">
      
      {/* Background Ambient Glow (Premium Touch) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 lg:mb-12 gap-5">
        <div className="w-full md:w-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
            Welcome back, {user?.name || 'Scholar'}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-400 mt-2 font-medium">
            Your autonomous study center is ready.
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/live')}
          className="w-full md:w-auto bg-red-500/10 text-red-400 border border-red-500/50 px-6 py-3.5 sm:py-3 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-red-500/20 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:-translate-y-0.5 active:translate-y-0"
        >
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
          Start Live Class
        </button>
      </div>

      {/* FILTER & SEARCH BAR (Responsive Grid) */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-5 mb-8 lg:mb-10 shadow-lg flex flex-col lg:flex-row gap-4">
        
        {/* Search Input */}
        <div className="flex-1 relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search lectures..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/50 text-white placeholder-slate-500 pl-11 pr-4 py-3 sm:py-2.5 rounded-xl border border-slate-700 focus:border-blue-500 outline-none transition text-sm sm:text-base"
          />
        </div>
        
        {/* Filter Grid (Stacks intelligently on mobile) */}
        <div className="grid grid-cols-3 gap-3 lg:w-auto">
          <input 
            type="text" 
            placeholder="Dept" 
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value.toUpperCase())}
            className="w-full bg-slate-950/50 text-white placeholder-slate-500 px-3 py-3 sm:py-2.5 rounded-xl border border-slate-700 focus:border-blue-500 outline-none transition text-sm sm:text-base text-center lg:text-left"
          />
          <select 
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="w-full bg-slate-950/50 text-white px-3 py-3 sm:py-2.5 rounded-xl border border-slate-700 focus:border-blue-500 outline-none transition appearance-none text-sm sm:text-base cursor-pointer"
          >
            <option value="">Lvl (All)</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
          </select>
          <select 
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            className="w-full bg-slate-950/50 text-white px-3 py-3 sm:py-2.5 rounded-xl border border-slate-700 focus:border-blue-500 outline-none transition appearance-none text-sm sm:text-base cursor-pointer"
          >
            <option value="">Sem (All)</option>
            <option value="I">Sem I</option>
            <option value="II">Sem II</option>
          </select>
        </div>
      </div>

      {/* LECTURES GRID */}
      {isLoading ? (
        <div className="flex justify-center items-center py-32">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-10 sm:p-16 text-center shadow-xl">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-200 mb-3">No lectures found.</h3>
          <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto">
            Your dashboard is empty or your filters are too strict. Hit "Start Live Class" to let the AI build your first study guide.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredNotes.map((note) => (
            <div key={note._id} className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 sm:p-6 hover:border-blue-500/40 hover:shadow-[0_10px_40px_rgba(59,130,246,0.15)] hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
              
              {/* Dynamic Badges */}
              <div className="flex justify-between items-center mb-4 sm:mb-5">
                <span className="text-[10px] sm:text-xs font-bold bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-md border border-blue-500/20 tracking-wide">
                  {note.department} • L{note.level} S{note.semester}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                  {new Date(note.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-3 group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">
                {note.title}
              </h3>
              
              {/* Keyword Pills */}
              {note.keywords && note.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {note.keywords.slice(0, 3).map((kw, idx) => (
                    <span key={idx} className="text-[9px] sm:text-[10px] uppercase tracking-wider bg-slate-950/80 text-slate-400 px-2.5 py-1 rounded-md border border-slate-800">
                      {kw.term}
                    </span>
                  ))}
                  {note.keywords.length > 3 && (
                    <span className="text-[10px] text-slate-500 py-1 font-medium">+{note.keywords.length - 3}</span>
                  )}
                </div>
              )}

              {/* Footer Actions */}
              <div className="mt-auto pt-5 flex gap-3 border-t border-slate-800/50">
                <button 
                  onClick={() => navigate(`/note/${note._id}`)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold py-3 sm:py-2.5 rounded-xl transition-all border border-slate-700 active:scale-95"
                >
                  View Notes
                </button>
                
                <button 
                  onClick={() => navigate(`/quiz/${note.quizId}`)}
                  disabled={!note.quizId}
                  className={`flex-1 text-xs sm:text-sm font-semibold py-3 sm:py-2.5 rounded-xl transition-all border active:scale-95 ${
                    note.quizId 
                      ? 'bg-indigo-600/15 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/30 hover:border-indigo-500/50' 
                      : 'bg-slate-900/50 text-slate-600 border-slate-800 cursor-not-allowed'
                  }`}
                >
                  {note.quizId ? 'Take Exam' : 'No Exam'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;