"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceCommand {
  patterns: string[];
  action: () => void;
  description: string;
}

export default function VoiceControl() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Voice commands
  const commands: VoiceCommand[] = [
    {
      patterns: ['גלול למעלה', 'scroll up', 'למעלה'],
      action: () => window.scrollBy({ top: -500, behavior: 'smooth' }),
      description: 'גלילה למעלה'
    },
    {
      patterns: ['גלול למטה', 'scroll down', 'למטה'],
      action: () => window.scrollBy({ top: 500, behavior: 'smooth' }),
      description: 'גלילה למטה'
    },
    {
      patterns: ['הראה אירועים', 'אירועים', 'events'],
      action: () => document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' }),
      description: 'מעבר לסקשן אירועים'
    },
    {
      patterns: ['הראה קורסים', 'קורסים', 'courses', 'בית ספר'],
      action: () => document.getElementById('school-section')?.scrollIntoView({ behavior: 'smooth' }),
      description: 'מעבר לסקשן קורסים'
    },
    {
      patterns: ['הראה מוזיקה', 'מוזיקה', 'music'],
      action: () => document.getElementById('music-section')?.scrollIntoView({ behavior: 'smooth' }),
      description: 'מעבר לסקשן מוזיקה'
    },
    {
      patterns: ['התחל', 'למעלה עד הסוף', 'start', 'top'],
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      description: 'חזרה לתחילת העמוד'
    },
    {
      patterns: ['סיום', 'למטה עד הסוף', 'end', 'bottom'],
      action: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }),
      description: 'מעבר לסוף העמוד'
    },
    {
      patterns: ['whatsapp', 'וואטסאפ', 'צור קשר'],
      action: () => {
        const waNumber = '972502427616';
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent('היי אלמוג, קראתי את העמוד ואני רוצה לדבר!')}`, '_blank');
      },
      description: 'פתיחת WhatsApp'
    }
  ];

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.lang = 'he-IL';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        const transcriptText = result[0].transcript.toLowerCase();
        setTranscript(transcriptText);

        if (result.isFinal) {
          processCommand(transcriptText);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start(); // Auto-restart
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  // Process voice command
  const processCommand = (text: string) => {
    for (const command of commands) {
      for (const pattern of command.patterns) {
        if (text.includes(pattern.toLowerCase())) {
          setLastCommand(command.description);
          command.action();
          
          // Clear after 2 seconds
          setTimeout(() => setLastCommand(''), 2000);
          return;
        }
      }
    }
  };

  // Toggle listening
  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript('');
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!isSupported) return null;

  return (
    <>
      {/* Voice Control Button */}
      <div className="fixed bottom-24 right-8 z-50">
        <button
          onClick={toggleListening}
          className={`group relative flex h-14 w-14 items-center justify-center rounded-full border-2 backdrop-blur-md transition-all hover:scale-110 ${
            isListening
              ? 'animate-pulse border-red-500 bg-red-500/20 hover:border-red-400 hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]'
              : 'border-brand-blue/40 bg-black/60 hover:border-brand-blue hover:bg-black/80 hover:shadow-[0_0_30px_rgba(5,156,192,0.5)]'
          }`}
          aria-label={isListening ? 'Stop voice control' : 'Start voice control'}
        >
          {isListening ? (
            <svg className="h-6 w-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          ) : (
            <svg className="h-6 w-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}

          {/* Pulse animation when listening */}
          {isListening && (
            <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-red-500 opacity-75" />
          )}

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 hidden w-48 rounded-lg bg-black/90 p-3 text-xs text-white backdrop-blur-md group-hover:block">
            <p className="mb-2 font-semibold">🎤 בקרה קולית</p>
            <p className="text-white/70">לחץ והגד פקודות כמו:</p>
            <p className="mt-1 text-brand-blue">"הראה אירועים"</p>
            <p className="text-brand-blue">"גלול למטה"</p>
            <p className="text-brand-blue">"וואטסאפ"</p>
          </div>
        </button>
      </div>

      {/* Live Transcript */}
      <AnimatePresence>
        {isListening && transcript && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-40 right-8 z-50 max-w-xs"
          >
            <div className="rounded-xl border border-white/10 bg-black/80 p-4 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">שומע...</p>
              <p className="mt-1 text-sm text-white">{transcript}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Confirmation */}
      <AnimatePresence>
        {lastCommand && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed right-8 top-24 z-50"
          >
            <div className="rounded-xl border border-brand-green bg-black/90 px-4 py-3 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <span className="text-brand-green">✓</span>
                <p className="text-sm text-white">{lastCommand}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
