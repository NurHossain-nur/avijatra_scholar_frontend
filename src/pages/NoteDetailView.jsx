import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../hooks/useAxiosSecure';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const NoteDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axiosSecure.get(`/lectures/note/${id}`);
        setNote(res.data.note);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id, axiosSecure]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[85vh]">
      <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p className="text-blue-400 font-medium tracking-wide animate-pulse text-sm sm:text-base">Rendering Textbook...</p>
    </div>
  );
  
  if (!note) return (
    <div className="flex justify-center items-center min-h-[85vh]">
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-10 text-center max-w-md mx-4">
        <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-2">Note Not Found</h2>
        <p className="text-slate-400 text-sm sm:text-base mb-6">This lecture might have been deleted or doesn't exist.</p>
        <button onClick={() => navigate('/dashboard')} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl transition">Return to Dashboard</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 relative overflow-hidden">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-600/10 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-600/10 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none -z-10"></div>

      {/* LEFT SIDEBAR: Metadata & Navigation */}
      <div className="col-span-1 lg:col-span-3 space-y-5 sm:space-y-6 order-2 lg:order-1">
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-slate-900/50 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/50 px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 group w-fit text-sm sm:text-base active:scale-95 shadow-sm"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Dashboard
        </button>

        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 shadow-xl rounded-2xl p-5 sm:p-6">
          <h2 className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 sm:mb-5 border-b border-slate-700/50 pb-2">Lecture Info</h2>
          
          {/* Responsive Grid for Metadata: 2 columns on mobile, 1 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5">
            <div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-semibold mb-0.5">Department</p>
              <p className="text-slate-200 text-sm sm:text-base font-bold bg-slate-800/50 w-fit px-2.5 py-1 rounded-md border border-slate-700/50">{note.department}</p>
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-semibold mb-0.5">Level & Semester</p>
              <p className="text-slate-200 text-sm sm:text-base font-bold bg-slate-800/50 w-fit px-2.5 py-1 rounded-md border border-slate-700/50">L{note.level} • S{note.semester}</p>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-semibold mb-0.5">Generated On</p>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">{new Date(note.createdAt).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* Action Items / Homework List */}
        {note.actionItems && note.actionItems.length > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-lg">
            <h2 className="text-[10px] sm:text-xs font-bold text-yellow-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Class Tasks
            </h2>
            <ul className="space-y-3">
              {note.actionItems.map((item, i) => (
                <li key={i} className="text-xs sm:text-sm text-yellow-200/80 flex items-start gap-2 leading-relaxed">
                  <span className="text-yellow-500/50 mt-0.5">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* MAIN CONTENT: The Notes */}
      <div className="col-span-1 lg:col-span-9 bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-5 sm:p-8 lg:p-12 shadow-2xl order-1 lg:order-2">
        <header className="mb-8 sm:mb-12 border-b border-slate-700/60 pb-6 sm:pb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-5 leading-tight tracking-tight">
            {note.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {note.keywords?.map((kw, i) => (
              <span key={i} className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full border border-blue-500/20 transition-colors cursor-default shadow-sm">
                {kw.term}
              </span>
            ))}
          </div>
        </header>

        {/* Fluid Prose container scales text up gracefully based on screen size */}
        <article className="prose prose-sm sm:prose-base lg:prose-lg prose-invert prose-blue max-w-none prose-headings:text-slate-100 prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white">
          <ReactMarkdown
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <div className="relative group my-8">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      className="relative rounded-2xl border border-slate-700 m-0 shadow-2xl text-xs sm:text-sm lg:text-base hidden-scrollbar"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className="bg-slate-800 text-blue-300 px-2 py-0.5 rounded-md border border-slate-700/50 text-xs sm:text-sm" {...props}>
                    {children}
                  </code>
                )
              },
              h1: (p) => <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-10 sm:mt-12 mb-6" {...p} />,
              h2: (p) => <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-8 sm:mt-10 mb-5 border-b border-slate-700/50 pb-3 text-blue-50" {...p} />,
              h3: (p) => <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mt-6 sm:mt-8 mb-4 text-blue-100" {...p} />,
              p: (p) => <p className="leading-relaxed mb-6" {...p} />,
              ul: (p) => <ul className="list-disc list-outside ml-4 sm:ml-6 space-y-2 mb-6" {...p} />,
              li: (p) => <li className="pl-1 sm:pl-2" {...p} />
            }}
          >
            {note.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
};

export default NoteDetailView;