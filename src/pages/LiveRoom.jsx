import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAudioStream from '../hooks/useAudioStream';
import useAxiosSecure from '../hooks/useAxiosSecure'; 
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const LiveRoom = () => {
  const { isRecording, isPaused, startRecording, pauseRecording, resumeRecording, stopRecording, liveNotes, liveKeywords } = useAudioStream();
  const [outputLang, setOutputLang] = useState('English');
  const [classTitle, setClassTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Default values set for quick testing
  const [department, setDepartment] = useState('CSE');
  const [level, setLevel] = useState('3');
  const [semester, setSemester] = useState('II');
  
  const notesEndRef = useRef(null);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    notesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveNotes]);

  const handleStart = () => {
    if (!classTitle.trim()) {
      alert("⚠️ Please enter a Lecture Title to start.");
      return;
    }
    if (!department.trim()) {
      alert("⚠️ Please enter your Department (e.g., CSE).");
      return;
    }
    startRecording(outputLang);
  };

  const handleEndAndSave = async () => {
    if (!classTitle.trim()) return;

    stopRecording();
    setIsSaving(true);

    const fullMarkdown = liveNotes.join('\n\n');

    try {
      const response = await axiosSecure.post('/lectures/save-and-generate-quiz', {
        title: classTitle,
        language: outputLang,
        department: department,
        level: level,
        semester: semester,
        fullMarkdown: fullMarkdown,
        keywords: liveKeywords
      });

      if (response.data.success) {
        navigate(`/quiz/${response.data.quizId}`); 
      }
    } catch (error) {
      console.error("Failed to save lecture:", error);
      alert("There was an error saving the lecture.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 min-h-[85vh] text-slate-200 px-4 sm:px-6 lg:px-8 py-6 lg:py-10 relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      {/* SIDEBAR: Controls & Context */}
      <div className="w-full xl:w-[380px] flex flex-col gap-6 z-10 shrink-0">
        
        {/* Glass Control Panel */}
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 shadow-2xl rounded-3xl p-6 sm:p-8 flex flex-col items-center relative">
          
          {/* Dynamic Status Indicator */}
          <div className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full border-[3px] sm:border-4 flex items-center justify-center mb-6 sm:mb-8 transition-all duration-700 ${
            isRecording && !isPaused ? 'border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.35)] animate-pulse' : 
            isPaused ? 'border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.25)]' : 
            'border-slate-700 bg-slate-800/50'
          }`}>
            <span className={`font-black tracking-widest text-xs sm:text-sm text-center ${
                isRecording && !isPaused ? 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 
                isPaused ? 'text-yellow-500' : 'text-slate-500'
            }`}>
              {isRecording && !isPaused ? 'ON AIR' : isPaused ? 'PAUSED' : 'STANDBY'}
            </span>
          </div>

          <div className="w-full space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <input 
              type="text" 
              placeholder="* Lecture Title (Required)" 
              value={classTitle}
              onChange={(e) => setClassTitle(e.target.value)}
              disabled={isRecording || isSaving}
              className={`w-full bg-slate-950/50 text-white placeholder-slate-500 px-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-xl outline-none transition border ${!classTitle && !isRecording ? 'border-red-500/40 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'}`}
            />

            <input 
              type="text" 
              placeholder="* Department (e.g., CSE)" 
              value={department}
              onChange={(e) => setDepartment(e.target.value.toUpperCase())}
              disabled={isRecording || isSaving}
              className={`w-full bg-slate-950/50 text-white placeholder-slate-500 px-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-xl outline-none transition border ${!department && !isRecording ? 'border-red-500/40 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'}`}
            />
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <select 
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                disabled={isRecording || isSaving}
                className="w-full bg-slate-950/50 text-white px-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-xl border border-slate-700 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
              >
                <option value="" disabled>Level</option>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
              </select>

              <select 
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                disabled={isRecording || isSaving}
                className="w-full bg-slate-950/50 text-white px-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-xl border border-slate-700 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
              >
                <option value="" disabled>Semester</option>
                <option value="I">Semester I</option>
                <option value="II">Semester II</option>
              </select>
            </div>

            <select 
              value={outputLang} 
              onChange={(e) => setOutputLang(e.target.value)}
              disabled={isRecording || isSaving}
              className="w-full bg-slate-950/50 text-white px-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-xl border border-slate-700 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
            >
              <option value="English">Output: English</option>
              <option value="Bangla">Output: Bangla</option>
              <option value="Both (English & Bangla)">Bilingual (Banglish)</option>
            </select>
          </div>

          {/* DYNAMIC BUTTON RENDERING */}
          {!isRecording ? (
            <button 
              onClick={handleStart}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold tracking-wide py-4 sm:py-4 text-sm sm:text-base rounded-xl transition-all shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_10px_40px_rgba(79,70,229,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              Start Autonomous Scholar
            </button>
          ) : (
            <div className="w-full flex gap-3">
              {isPaused ? (
                <button 
                  onClick={resumeRecording}
                  disabled={isSaving}
                  className="flex-1 bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 font-bold py-3.5 sm:py-4 text-sm sm:text-base rounded-xl transition-all active:scale-95"
                >
                  Resume
                </button>
              ) : (
                <button 
                  onClick={pauseRecording}
                  disabled={isSaving}
                  className="flex-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 hover:bg-yellow-500/20 font-bold py-3.5 sm:py-4 text-sm sm:text-base rounded-xl transition-all active:scale-95"
                >
                  Pause
                </button>
              )}
              
              <button 
                onClick={handleEndAndSave}
                disabled={isSaving}
                className="flex-[1.5] bg-slate-950 text-red-400 border border-red-500/30 hover:bg-red-500/10 font-bold py-3.5 sm:py-4 text-sm sm:text-base rounded-xl transition-all flex justify-center items-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
              >
                {isSaving ? (
                  <span className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  'End & Save'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Live Keywords Flashcards (Responsive Height) */}
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 shadow-2xl rounded-3xl p-6 flex-1 max-h-[300px] xl:max-h-none overflow-y-auto hidden-scrollbar relative">
          <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md pb-3 mb-3 border-b border-slate-700/50 z-10">
            <h3 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest">Extracted Terms</h3>
          </div>
          
          {liveKeywords.length === 0 ? (
            <p className="text-slate-500 text-xs sm:text-sm italic text-center mt-8">Terms will appear dynamically...</p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {liveKeywords.map((kw, idx) => (
                <div key={idx} className="bg-slate-950/50 p-4 rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-colors group">
                  <h4 className="text-blue-400 font-bold text-sm sm:text-base mb-1.5 group-hover:text-blue-300">{kw.term}</h4>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{kw.definition}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MAIN AREA: Live Markdown Rendering */}
      <div className="flex-1 bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-12 flex flex-col relative z-10 min-h-[500px]">
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 border-b border-slate-700/50 pb-6 sticky top-0 bg-slate-900/20 backdrop-blur-xl z-20 rounded-xl px-4 -mx-4 pt-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent line-clamp-1">
            {classTitle || 'Untitled Lecture'}
          </h1>
          <div className="flex items-center gap-2.5 bg-slate-950/50 px-4 py-2 rounded-full border border-slate-800 self-start sm:self-auto">
            <span className={`w-2.5 h-2.5 rounded-full ${isRecording && !isPaused ? 'bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]' : isPaused ? 'bg-yellow-500' : 'bg-slate-600'}`}></span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-300 tracking-widest uppercase">
              {isRecording && !isPaused ? 'AI Sync Active' : isPaused ? 'AI Paused' : 'AI Offline'}
            </span>
          </div>
        </div>
        
        {/* Fluid Typography inside the Prose */}
        <div className="flex-1 overflow-y-auto pr-2 sm:pr-4 hidden-scrollbar prose prose-sm sm:prose-base lg:prose-lg prose-invert prose-blue max-w-none">
          {liveNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-40 mt-10 sm:mt-20">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-6 text-slate-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-center mb-2">The Autonomous Scholar is standing by.</p>
              <p className="text-sm sm:text-base text-center max-w-md">Hit start, place your device near the professor, and let the AI build your textbook.</p>
            </div>
          ) : (
            liveNotes.map((noteChunk, index) => (
              <div key={index} className="animate-fade-in-up mb-8 sm:mb-10">
                <ReactMarkdown
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <div className="relative group mt-5 mb-8">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            className="relative rounded-2xl border border-slate-700 m-0 shadow-2xl text-xs sm:text-sm lg:text-base custom-scrollbar"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className="bg-slate-800 text-blue-300 px-2 py-1 rounded-md text-xs sm:text-sm border border-slate-700/50" {...props}>
                          {children}
                        </code>
                      )
                    },
                    h1: ({node, ...props}) => <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-10 mb-6 leading-tight" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-100 mt-8 mb-5 border-b border-slate-700/50 pb-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-blue-200 mt-6 mb-3" {...props} />,
                    p: ({node, ...props}) => <p className="text-slate-300 leading-relaxed mb-5" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-outside ml-5 text-slate-300 space-y-2.5 mb-6" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1" {...props} />,
                  }}
                >
                  {noteChunk}
                </ReactMarkdown>
              </div>
            ))
          )}
          <div ref={notesEndRef} className="h-10" />
        </div>
      </div>
    </div>
  );
};

export default LiveRoom;