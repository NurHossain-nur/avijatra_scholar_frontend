import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAxiosPublic from '../hooks/useAxiosPublic';

const VerifyEmail = () => {
    const { token } = useParams();
    const axiosPublic = useAxiosPublic();
    const [status, setStatus] = useState({ loading: true, success: false, message: '' });
    
    // --- ADD THIS REF TO STOP DOUBLE-FIRING ---
    const hasFired = useRef(false);

    useEffect(() => {
        // If the API has already been called, immediately stop the second Strict Mode run
        if (hasFired.current) return;
        hasFired.current = true;

        const verifyAccount = async () => {
            try {
                const res = await axiosPublic.get(`/auth/verifyemail/${token}`);
                if (res.data.success) {
                    setStatus({ loading: false, success: true, message: res.data.message });
                }
            } catch (error) {
                setStatus({ 
                    loading: false, 
                    success: false, 
                    message: error.response?.data?.message || 'Verification failed or link expired.' 
                });
            }
        };

        verifyAccount();
    }, [token, axiosPublic]);

    return (
        <div className="flex justify-center items-center min-h-[70vh] px-4">
            <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 shadow-2xl p-8 sm:p-10 w-full max-w-md rounded-3xl text-center">
                {status.loading ? (
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                        <h2 className="text-xl font-bold text-white">Verifying Account...</h2>
                    </div>
                ) : status.success ? (
                    <div className="animate-fade-in-up">
                        <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Verification Complete!</h2>
                        <p className="text-slate-400 mb-8">{status.message}</p>
                        <Link to="/login" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition-all active:scale-95">
                            Proceed to Login
                        </Link>
                    </div>
                ) : (
                    <div className="animate-fade-in-up">
                        <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Verification Failed</h2>
                        <p className="text-slate-400 mb-8">{status.message}</p>
                        <Link to="/register" className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-8 rounded-xl border border-slate-700 transition-colors">
                            Register Again
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;