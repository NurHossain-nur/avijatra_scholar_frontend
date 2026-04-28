import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useAudioStream = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // NEW STATE
  const [liveNotes, setLiveNotes] = useState([]);
  const [liveKeywords, setLiveKeywords] = useState([]);

  const socketRef = useRef(null);
  const streamRef = useRef(null);
  const isRecordingRef = useRef(false);
  const isPausedRef = useRef(false); // NEW REF
  const recorderRef = useRef(null);

  // Change your useEffect to ONLY handle cleanup
  useEffect(() => {
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const recordChunk = () => {
    // If we are not recording, OR if we are paused, do not start a new chunk!
    if (!isRecordingRef.current || isPausedRef.current || !streamRef.current) return;

    const mediaRecorder = new MediaRecorder(streamRef.current, { mimeType: 'audio/webm' });
    recorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0 && socketRef.current) {
        socketRef.current.emit('audio-file-chunk', event.data);
      }
    };

    mediaRecorder.start();

    setTimeout(() => {
      if (mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        // Only trigger the next loop if we are still recording and NOT paused
        if (isRecordingRef.current && !isPausedRef.current) {
          recordChunk(); 
        }
      }
    }, 30000); 
  };

  const startRecording = async (selectedLanguage = 'English') => {
    try {

      // --- LAZY SOCKET CONNECTION ---
      if (!socketRef.current) {
        const socketUrl = import.meta.env.VITE_API_URL.replace('/api', '');
        socketRef.current = io(socketUrl);

        socketRef.current.on('ai-transcription-update', (data) => {
          if (data.type === 'note') {
            setLiveNotes((prev) => [...prev, data.content]);
          } else if (data.type === 'keyword') {
            setLiveKeywords((prev) => [data.content, ...prev]);
          }
        });
      }
      // ------------------------------

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      isRecordingRef.current = true;
      isPausedRef.current = false;
      setIsRecording(true);
      setIsPaused(false);
      
      socketRef.current.emit('start-session', { 
        timestamp: Date.now(),
        language: selectedLanguage 
      });
      
      recordChunk();
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access is required to use the AI Co-Pilot.');
    }
  };

  // --- NEW PAUSE/RESUME LOGIC ---
  const pauseRecording = () => {
    if (!isRecordingRef.current || isPausedRef.current) return;
    
    isPausedRef.current = true;
    setIsPaused(true);
    
    // Stop the current recorder to instantly send whatever audio was captured before pausing
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop(); 
    }
  };

  const resumeRecording = () => {
    if (!isRecordingRef.current || !isPausedRef.current) return;
    
    isPausedRef.current = false;
    setIsPaused(false);
    
    // Kickstart the 30-second loop again
    recordChunk();
  };
  // ------------------------------

  const stopRecording = () => {
    isRecordingRef.current = false;
    isPausedRef.current = false;
    setIsRecording(false);
    setIsPaused(false);
    
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    socketRef.current.emit('end-session');
  };

  // Export the new functions and state
  return { 
    isRecording, 
    isPaused, 
    startRecording, 
    pauseRecording, 
    resumeRecording, 
    stopRecording, 
    liveNotes, 
    liveKeywords 
  };
};

export default useAudioStream;