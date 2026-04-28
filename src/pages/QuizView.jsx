import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAxiosSecure from '../hooks/useAxiosSecure';

const QuizView = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const [quiz, setQuiz] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [activeTab, setActiveTab] = useState('mcq'); // 'mcq' or 'short'

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await axiosSecure.get(`/lectures/quiz/${id}`);
                setQuiz(res.data.quiz);
            } catch (err) {
                console.error("Failed to fetch quiz:", err);
            }
        };
        fetchQuiz();
    }, [id, axiosSecure]);

    if (!quiz) return (
        <div className="flex flex-col justify-center items-center min-h-[85vh]">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-blue-400 font-medium tracking-wide animate-pulse text-sm sm:text-base">Initializing Exam Environment...</p>
        </div>
    );

    const handleOptionSelect = (qIdx, option) => {
        if (submitted) return;
        setUserAnswers({ ...userAnswers, [qIdx]: option });
    };

    // Calculate score dynamically if submitted
    const score = submitted ? quiz.mcqs.reduce((acc, q, idx) => acc + (userAnswers[idx] === q.correctAnswer ? 1 : 0), 0) : 0;

    return (
        <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-[85vh]">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

            {/* HEADER SECTION */}
            <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-6 sm:p-10 mb-8 sm:mb-10 text-center relative shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 sm:w-60 h-40 sm:h-60 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3 tracking-tight">
                    Autonomous Model Test
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
                    Based on: <span className="text-blue-400 font-semibold">{quiz.noteId?.title || 'Lecture Notes'}</span>
                </p>
                
                {/* Responsive Segmented Tab Switcher */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 max-w-md mx-auto sm:max-w-none">
                    <button 
                        onClick={() => setActiveTab('mcq')}
                        className={`w-full sm:w-auto px-6 py-3.5 sm:py-3 rounded-xl sm:rounded-full transition-all duration-300 font-bold text-sm sm:text-base active:scale-95 ${
                            activeTab === 'mcq' 
                            ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' 
                            : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700/50'
                        }`}
                    >
                        MCQ Practice
                    </button>
                    <button 
                        onClick={() => setActiveTab('short')}
                        className={`w-full sm:w-auto px-6 py-3.5 sm:py-3 rounded-xl sm:rounded-full transition-all duration-300 font-bold text-sm sm:text-base active:scale-95 ${
                            activeTab === 'short' 
                            ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' 
                            : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700/50'
                        }`}
                    >
                        Mid/Quiz Prep (Gyan & Anudhabon)
                    </button>
                </div>
            </div>

            {/* MCQ SECTION */}
            {activeTab === 'mcq' && (
                <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
                    
                    {submitted && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center mb-8">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-green-400">Score: {score} / {quiz.mcqs.length}</h2>
                            <p className="text-green-300/70 mt-2 text-sm sm:text-base">Review your answers below.</p>
                        </div>
                    )}

                    {quiz.mcqs.map((q, idx) => (
                        <div key={idx} className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-5 sm:p-8 shadow-xl transition-all hover:border-slate-600/50">
                            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-100 mb-5 sm:mb-6 leading-relaxed">
                                <span className="text-blue-400 mr-2">{idx + 1}.</span> {q.question}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                {q.options.map((opt, oIdx) => {
                                    const isSelected = userAnswers[idx] === opt;
                                    const isCorrect = submitted && opt === q.correctAnswer;
                                    const isWrong = submitted && isSelected && opt !== q.correctAnswer;

                                    return (
                                        <button
                                            key={oIdx}
                                            onClick={() => handleOptionSelect(idx, opt)}
                                            disabled={submitted}
                                            className={`p-4 sm:p-5 rounded-2xl text-left transition-all duration-300 border text-sm sm:text-base font-medium min-h-[3.5rem] flex items-center ${
                                                !submitted && 'active:scale-[0.98]'
                                            } ${
                                                isCorrect ? 'bg-green-500/20 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)] text-green-300' :
                                                isWrong ? 'bg-red-500/20 border-red-500 text-red-300' :
                                                isSelected ? 'bg-blue-600/30 border-blue-500 text-blue-200 shadow-inner' :
                                                'bg-slate-800/40 border-slate-700/80 text-slate-300 hover:border-slate-500 hover:bg-slate-800/80 cursor-pointer'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            {submitted && (
                                <div className="mt-5 sm:mt-6 p-4 sm:p-5 bg-blue-900/20 rounded-2xl border border-blue-500/20 text-sm sm:text-base text-slate-300 leading-relaxed">
                                    <strong className="text-blue-400 block mb-1">Explanation:</strong> 
                                    {q.explanation}
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {!submitted && (
                        <div className="pt-4">
                            <button 
                                onClick={() => {
                                    if (Object.keys(userAnswers).length < quiz.mcqs.length) {
                                        if(!window.confirm('You have unanswered questions. Are you sure you want to submit?')) return;
                                    }
                                    setSubmitted(true);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="w-full py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-base sm:text-lg font-bold rounded-2xl shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all active:scale-[0.98]"
                            >
                                Submit MCQ Answers
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* SHORT QUESTIONS SECTION */}
            {activeTab === 'short' && (
                <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
                    {quiz.shortQuestions.map((q, idx) => (
                        <div key={idx} className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 relative group overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 px-4 sm:px-5 py-1.5 bg-blue-600/20 text-blue-400 text-[10px] sm:text-xs font-bold tracking-widest rounded-bl-2xl uppercase border-b border-l border-blue-500/20">
                                {q.type} Question
                            </div>
                            
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-100 mb-5 sm:mb-6 pr-16 sm:pr-24 leading-snug">
                                <span className="text-blue-400 mr-2">Q.</span>{q.question}
                            </h3>
                            
                            <div className="bg-slate-950/60 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-inner">
                                <div className="flex items-center gap-2 mb-3">
                                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <p className="text-[10px] sm:text-xs font-bold text-emerald-500/80 uppercase tracking-widest">AI Suggested Master Answer</p>
                                </div>
                                <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed sm:leading-loose">
                                    {q.suggestedAnswer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-12 sm:mt-16 text-center">
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm sm:text-base font-medium px-6 py-3 bg-slate-900/50 rounded-full border border-slate-800 hover:border-slate-600">
                    <span>←</span> Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default QuizView;